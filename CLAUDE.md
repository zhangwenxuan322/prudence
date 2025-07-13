# Prudence GRC Platform - Claude Development Guide

## Project Overview
Prudence is a Django-based Governance, Risk, and Compliance (GRC) platform for managing organizational risks and controls, with role-based access control and ISO 31000 compliance.

## Quick Start
```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Start development server
python manage.py runserver
```

## Architecture
- **Backend**: Django (Python)
- **Frontend**: JavaScript, HTML, CSS with Bootstrap
- **Database**: SQLite (development)
- **Visualizations**: Chart.js

## Key Models
- **User**: Extended with role field (L1, L2, L3)
- **Risk**: Core risk entity with inherent/residual attributes
- **Control**: Mitigation controls linked to risks

## Role System
- **L1 Users**: Can add risks (requires L2 approval)
- **L2 Users**: Can approve L1 risk additions
- **L3 Users**: Read-only access to risk management

## Development Commands
```bash
# Run tests (if available)
python manage.py test

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic
```

## File Structure
- `prudence/` - Main app with models, views, forms
- `templates/` - HTML templates
- `static/css/` - Styling files
- `accounts/` - User authentication and registration
- `templatetags/` - Custom template filters

## Recent Changes
- Added user role field and role-based access control
- Implemented L1/L2 approval workflow for risk additions
- Added role controls to risk management pages
- Enhanced user registration with role assignment

## Testing
Check the project for existing test files or ask the user for the testing approach if needed.

## Linting/Type Checking
Check for Django-specific linting tools or ask the user for the preferred commands.