import json
import io
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from io import BytesIO
import base64
from matplotlib.colors import LinearSegmentedColormap
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .forms import RiskForm, ControlForm
from .models import Risk, Control, Action
from datetime import timedelta

def add_risk(request):
    if request.method == 'POST':
        form = RiskForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Risk added successfully.')
            return redirect('risk_list')  # Redirect to the risk list after adding
    else:
        form = RiskForm()
    return render(request, 'add_risk.html', {'form': form})

def add_control(request):
    if request.method == 'POST':
        form = ControlForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('control_list')  
    else:
        form = ControlForm()
    return render(request, 'add_control.html', {'form': form})

def risk_list(request):
    risks = Risk.objects.all().prefetch_related('controls', 'controls__owner')
    return render(request, 'risk_list.html', {'risks': risks})

def get_effectiveness_description(value):
    """ Convert numerical effectiveness to descriptive text. """
    descriptions = {
        0.0: 'Not Effective',
        0.5: 'Partially Effective',
        1.0: 'Fully Effective',
    }
    return descriptions.get(value, 'Unknown')

def control_list(request):
    controls = Control.objects.all()  # Retrieve all controls from the database
    controls_data = [
        {
            'name': control.name,
            'description': control.description,
            'effectiveness': get_effectiveness_description(control.effectiveness),
            'owner': control.owner.username
        } for control in controls
    ]
    return render(request, 'control_list.html', {'controls': controls})

def edit_risk(request, risk_id):
    risk = get_object_or_404(Risk, id=risk_id)
    if request.method == 'POST':
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            form = RiskForm(request.POST, instance=risk)
            if form.is_valid():
                form.save()
                data = {
                    'success': True,
                    'id': risk.id,
                    'description': risk.description,
                    'inherent_probability': risk.inherent_probability,
                    'inherent_impact': risk.inherent_impact,
                    'inherent_risk_rating': risk.inherent_risk_rating
                }
                return JsonResponse(data)
            else:
                return JsonResponse({'success': False, 'errors': form.errors})
        else:
            form = RiskForm(request.POST, instance=risk)
            if form.is_valid():
                form.save()
                return redirect('risk_list')
    else:
        form = RiskForm(instance=risk)
    return render(request, 'edit_risk.html', {'form': form, 'risk': risk})

def edit_control(request, control_id):
    control = get_object_or_404(Control, id=control_id)
    if request.method == 'POST':
        form = ControlForm(request.POST, instance=control)
        if form.is_valid():
            form.save()
            return redirect('control_list')  # Redirect to the list of controls
    else:
        form = ControlForm(instance=control)
    
    return render(request, 'edit_control.html', {'form': form, 'control': control})

def risk_register(request):
    risks = Risk.objects.prefetch_related('controls').all()
    risks_data = [
        {
            'description': risk.description,
            'inherent_probability': risk.inherent_probability,
            'inherent_impact': risk.inherent_impact,
            'residual_probability': risk.residual_probability,
            'residual_impact': risk.residual_impact,
            'controls': [control.name for control in risk.controls.all()],
        }
        for risk in risks
    ]
    context = {
        'risks_json': json.dumps(risks_data)
    }
    return render(request, 'risk_register.html', context)

def delete_control(request, control_id):
    control = get_object_or_404(Control, id=control_id)
    if request.method == 'POST':
        control.delete()
        messages.success(request, 'Successfully deleted control')
        return redirect('control_list')  # Redirect to the control list after deletion
    return redirect('control_list')  # Redirect here as well if not POST to handle accidental GET requests gracefully

def delete_risk(request, risk_id):
    risk = get_object_or_404(Risk, id=risk_id)
    if request.method == 'POST':
        risk.delete()
        messages.success(request, 'Successfully deleted risk')
        return redirect('risk_list')  # Redirect to the risk list after deletion
    return redirect('risk_list')  # Redirect here as well if not POST to handle accidental GET requests gracefully

def assigned_items(request):
    assigned_risks = Risk.objects.filter(risk_owner=request.user)
    assigned_controls = Control.objects.filter(owner=request.user)
    assigned_actions = Action.objects.filter(owner=request.user)
    context = {
        'risks': assigned_risks,
        'controls': assigned_controls,
        'actions': assigned_actions
    }
    return render(request, 'assigned_items.html', context)

def risk_matrix(request):
    risks = Risk.objects.all()
    # Prepare data for Chart.js
    risk_data = [
        {
            'description': risk.description,
            'inherentProbability': risk.get_description_display('inherent_probability'),
            'inherentImpact': risk.get_description_display('inherent_impact'),
            'residualProbability': risk.get_description_display('residual_probability'),
            'residualImpact': risk.get_description_display('residual_impact'),
            'inherentRiskRating': risk.inherent_risk_rating,
            'residualRiskRating': risk.residual_risk_rating,
        } for risk in risks
    ]
    context = {'risks_json': json.dumps(risk_data)}
    return render(request, 'risk_matrix.html', context)

def risk_register(request):
    risks = Risk.objects.prefetch_related('controls').all()
    risks_data = [
        {
            'description': risk.description,
            'inherent_probability': risk.inherent_probability,
            'inherent_impact': risk.inherent_impact,
            'residual_probability': risk.residual_probability,
            'residual_impact': risk.residual_impact,
            'controls': [{'name': control.name} for control in risk.controls.all()]
        }
        for risk in risks
    ]
    context = {
        'risks_json': json.dumps(risks_data)  # This is the JSON data for the frontend
    }
    return render(request, 'risk_register.html', context)

def risk_matrix(request):
    risks = Risk.objects.all()
    matrix = np.zeros((5, 5))
    cmap = plt.get_cmap('Reds')
    for risk in risks:
        x = risk.inherent_probability - 1
        y = risk.inherent_impact - 1
        matrix[x, y] += 1
    fig, ax = plt.subplots()
    cax = ax.matshow(matrix, cmap=cmap)
    plt.colorbar(cax)
    plt.title('Risk Matrix')
    img_io = BytesIO()
    plt.savefig(img_io, format='png', bbox_inches='tight')
    img_io.seek(0)
    base64_image = base64.b64encode(img_io.read()).decode('utf-8')
    return render(request, 'risk_matrix.html', {'risk_matrix_image': base64_image})