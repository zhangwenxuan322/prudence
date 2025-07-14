from rest_framework import serializers
from .models import Risk, Control, RiskAssessment, RiskType, Action
from accounts.serializers import UserSerializer


class RiskTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiskType
        fields = '__all__'


class ActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Action
        fields = '__all__'


class ControlSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    owner_id = serializers.IntegerField(write_only=True)
    effectiveness_display = serializers.SerializerMethodField()

    class Meta:
        model = Control
        fields = '__all__'

    def get_effectiveness_display(self, obj):
        effectiveness = obj.effectiveness
        if effectiveness == 0.0:
            return 'Not Effective'
        elif effectiveness == 0.5:
            return 'Partially Effective'
        elif effectiveness == 1.0:
            return 'Fully Effective'
        return 'Unknown'


class RiskSerializer(serializers.ModelSerializer):
    owner = UserSerializer(source='risk_owner', read_only=True)
    assessor = UserSerializer(read_only=True)
    controls = ControlSerializer(many=True, read_only=True)
    risk_type = RiskTypeSerializer(read_only=True)
    
    owner_id = serializers.IntegerField(source='risk_owner_id', write_only=True)
    assessor_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    control_ids = serializers.ListField(
        child=serializers.IntegerField(), 
        write_only=True, 
        required=False, 
        default=list
    )
    risk_type_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    
    inherent_rating = serializers.SerializerMethodField()
    residual_rating = serializers.SerializerMethodField()
    risk_level = serializers.SerializerMethodField()

    class Meta:
        model = Risk
        fields = '__all__'

    def get_inherent_rating(self, obj):
        return obj.inherent_probability * obj.inherent_impact

    def get_residual_rating(self, obj):
        return obj.residual_probability * obj.residual_impact

    def get_risk_level(self, obj):
        rating = obj.residual_probability * obj.residual_impact
        if rating >= 20:
            return 'critical'
        elif rating >= 15:
            return 'high'
        elif rating >= 10:
            return 'medium'
        else:
            return 'low'

    def create(self, validated_data):
        control_ids = validated_data.pop('control_ids', [])
        risk = Risk.objects.create(**validated_data)
        if control_ids:
            risk.controls.set(control_ids)
        return risk

    def update(self, instance, validated_data):
        control_ids = validated_data.pop('control_ids', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if control_ids is not None:
            instance.controls.set(control_ids)
        
        return instance


class RiskAssessmentSerializer(serializers.ModelSerializer):
    risk = RiskSerializer(read_only=True)
    assessor = UserSerializer(read_only=True)
    risk_id = serializers.IntegerField(write_only=True)
    assessor_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = RiskAssessment
        fields = '__all__'


class DashboardStatsSerializer(serializers.Serializer):
    total_risks = serializers.IntegerField()
    high_risks = serializers.IntegerField()
    pending_assessments = serializers.IntegerField()
    my_risks = serializers.IntegerField()
    my_controls = serializers.IntegerField()