from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Count
from .models import Risk, Control, RiskAssessment, RiskType, Action
from .serializers import (
    RiskSerializer, ControlSerializer, RiskAssessmentSerializer,
    RiskTypeSerializer, ActionSerializer, DashboardStatsSerializer
)


class RiskViewSet(viewsets.ModelViewSet):
    serializer_class = RiskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Risk.objects.all().select_related('owner', 'assessor', 'risk_type').prefetch_related('controls')
        
        # Filter by search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(description__icontains=search)
        
        # Filter by owner
        owner = self.request.query_params.get('owner')
        if owner:
            queryset = queryset.filter(owner_id=owner)
        
        # Filter by assessor
        assessor = self.request.query_params.get('assessor')
        if assessor:
            queryset = queryset.filter(assessor_id=assessor)
        
        # Filter by risk type
        risk_type = self.request.query_params.get('risk_type')
        if risk_type:
            queryset = queryset.filter(risk_type_id=risk_type)
        
        return queryset.order_by('-created_at')

    @action(detail=False, methods=['get'])
    def my_risks(self, request):
        """Get risks assigned to the current user"""
        risks = self.get_queryset().filter(
            Q(owner=request.user) | Q(assessor=request.user)
        )
        serializer = self.get_serializer(risks, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def matrix(self, request):
        """Get risk matrix data for visualization"""
        risks = self.get_queryset()
        inherent_data = []
        residual_data = []
        
        for risk in risks:
            risk_data = self.get_serializer(risk).data
            inherent_data.append({
                'x': risk.inherent_probability,
                'y': risk.inherent_impact,
                'risk': risk_data
            })
            residual_data.append({
                'x': risk.residual_probability,
                'y': risk.residual_impact,
                'risk': risk_data
            })
        
        return Response({
            'inherent': inherent_data,
            'residual': residual_data
        })


class ControlViewSet(viewsets.ModelViewSet):
    serializer_class = ControlSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Control.objects.all().select_related('owner')
        
        # Filter by search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )
        
        # Filter by owner
        owner = self.request.query_params.get('owner')
        if owner:
            queryset = queryset.filter(owner_id=owner)
        
        # Filter by effectiveness
        effectiveness = self.request.query_params.get('effectiveness')
        if effectiveness:
            queryset = queryset.filter(effectiveness=effectiveness)
        
        return queryset.order_by('-created_at')

    @action(detail=False, methods=['get'])
    def my_controls(self, request):
        """Get controls assigned to the current user"""
        controls = self.get_queryset().filter(owner=request.user)
        serializer = self.get_serializer(controls, many=True)
        return Response(serializer.data)


class RiskAssessmentViewSet(viewsets.ModelViewSet):
    serializer_class = RiskAssessmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = RiskAssessment.objects.all().select_related('risk', 'assessor')
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by assessor
        assessor = self.request.query_params.get('assessor')
        if assessor:
            queryset = queryset.filter(assessor_id=assessor)
        
        # L2 users see assessments assigned to them
        if self.request.user.role == 'L2':
            queryset = queryset.filter(assessor=self.request.user)
        
        return queryset.order_by('-created_at')


class RiskTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = RiskType.objects.all()
    serializer_class = RiskTypeSerializer
    permission_classes = [IsAuthenticated]


class ActionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Action.objects.all()
    serializer_class = ActionSerializer
    permission_classes = [IsAuthenticated]


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics"""
    user = request.user
    
    # Total risks
    total_risks = Risk.objects.count()
    
    # High risk count (rating >= 15)
    high_risks = Risk.objects.filter(
        residual_probability__gte=3, residual_impact__gte=5
    ).count() + Risk.objects.filter(
        residual_probability__gte=5, residual_impact__gte=3
    ).count()
    
    # Pending assessments for L2 users
    pending_assessments = 0
    if user.role == 'L2':
        pending_assessments = RiskAssessment.objects.filter(
            assessor=user, status='Pending'
        ).count()
    
    # User's risks and controls
    my_risks = Risk.objects.filter(
        Q(owner=user) | Q(assessor=user)
    ).count()
    
    my_controls = Control.objects.filter(owner=user).count()
    
    stats = {
        'total_risks': total_risks,
        'high_risks': high_risks,
        'pending_assessments': pending_assessments,
        'my_risks': my_risks,
        'my_controls': my_controls,
    }
    
    serializer = DashboardStatsSerializer(stats)
    return Response(serializer.data)