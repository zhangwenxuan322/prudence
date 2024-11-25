from django import template
from prudence.models import PROBABILITY_CHOICES, IMPACT_CHOICES

register = template.Library()

@register.filter(name='get_description')
def get_description(value, arg):
    if arg == 'prob':
        return dict(PROBABILITY_CHOICES).get(value, 'Unknown')
    elif arg == 'impact':
        return dict(IMPACT_CHOICES).get(value, 'Unknown')

RISK_RATING_CHOICES = {
    1: 'Very Low',
    2: 'Low',
    3: 'Moderate',
    4: 'High',
    5: 'Very High',
}

# Enhanced mapping to cover possible ranges
def risk_rating_to_description(value):
    if value < 1.5:
        return 'Very Low'
    elif 1.5 <= value < 3.5:
        return 'Low'
    elif 3.5 <= value < 6.5:
        return 'Moderate'
    elif 6.5 <= value < 8.5:
        return 'High'
    elif value >= 8.5:
        return 'Very High'
    return 'Out of Range'  # For unexpected values

@register.filter
def get_risk_description(value):
    try:
        value = float(value)  # Ensuring the value can be evaluated
        return risk_rating_to_description(value)
    except (TypeError, ValueError):
        return 'Invalid Input'  # In case of non-numeric inputs