# Prudence GRC Platform - Enterprise Risk Management System

## Project Overview
Prudence is a modern, web-based Governance, Risk, and Compliance (GRC) platform designed to assist organizations in identifying, assessing, and mitigating risks. The system leverages Django as its robust backend API and React with Tailwind CSS for a dynamic, responsive frontend experience.

Prudence provides comprehensive tools for managing risks and controls, evaluating inherent and residual risks, monitoring control effectiveness, and ensuring compliance with ISO 31000 standards.

## Key Features

### Modern Architecture
- **Backend**: Django REST Framework (Pure API)
- **Frontend**: React with TypeScript + Tailwind CSS
- **Authentication**: JWT-based with role-based access control
- **Database**: SQLite (development) / PostgreSQL (production ready)

### Risk Management
- **Risk Register**: Add, edit, and view risks with inherent and residual attributes
- **Risk Matrix**: Visual 5x5 risk assessment matrix following ISO 31000 standards
- **Control Management**: Link and manage controls that mitigate risks
- **Assessment Workflow**: L1/L2 approval process for risk submissions

### Enterprise GRC Features
- **Role-based Access**: L1 (Risk Reporter), L2 (Risk Manager), L3 (Risk Observer)
- **Professional Sidebar**: Inspired by Camms GRC with comprehensive menu structure
- **Dashboard**: Real-time statistics and executive overview
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### User Experience
- **Modern UI**: Glass morphism effects, smooth animations, professional styling
- **Authentication Flow**: Login, registration, and forgot password with validation
- **Interactive Elements**: Sortable tables, filtering, search functionality
- **Accessibility**: High contrast colors, keyboard navigation support

## Architecture Overview

### GRC Menu Structure (Inspired by Camms)
```
Overview
   ├── Dashboard (Executive overview & KPIs)
   └── My Workspace (Personal tasks & assignments)

Risk Management
   ├── Risk Register (Identify & assess risks)
   ├── Risk Matrix (Visual risk assessment)
   ├── Risk Appetite (Coming soon)
   └── Incident Management (Coming soon)

Controls & Compliance
   ├── Controls Library (Manage risk controls)
   ├── Control Testing (Coming soon)
   ├── Compliance Framework (Coming soon)
   └── Audit Management (Coming soon)

Governance
   ├── Risk Assessments (L2 approval workflow)
   ├── Policies & Procedures (Coming soon)
   └── Strategic Planning (Coming soon)

Third Party & Cyber
   ├── Vendor Management (Coming soon)
   ├── Cyber Security (Coming soon)
   └── Business Continuity (Coming soon)

Reports & Analytics
   ├── Executive Reports (Coming soon)
   └── Key Risk Indicators (Coming soon)

Administration
   ├── User Management (Coming soon)
   ├── Training & Awareness (Coming soon)
   └── System Settings
```

## Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 14+
- npm or yarn
- Conda (Anaconda or Miniconda)

### Backend Setup (Django API)

1. **Create and activate conda environment:**
   ```bash
   conda create -n prudence python=3.10
   conda activate prudence
   # Verify you're using conda python3:
   which python3  # Should show path with 'prudence' environment
   ```

2. **Navigate to project root:**
   ```bash
   cd /path/to/prudence
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run database migrations:**
   ```bash
   python3 manage.py migrate
   ```

5. **Create a superuser (optional):**
   ```bash
   python3 manage.py createsuperuser
   ```

6. **Start Django development server:**
   ```bash
   python3 manage.py runserver
   ```
   
   Django backend will be available at: http://localhost:8000
   - API endpoints: http://localhost:8000/api/
   - Admin panel: http://localhost:8000/admin/

### Frontend Setup (React App)

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start React development server:**
   ```bash
   npm start
   ```
   
   React frontend will be available at: http://localhost:3000

## Accessing Your Application

Once both servers are running:

1. **Main Application**: http://localhost:3000 - Modern React interface
2. **API Documentation**: http://localhost:8000/api/ - Browsable API endpoints
3. **Django Admin**: http://localhost:8000/admin/ - Backend administration

## User Management & Roles

### Creating Test Users

**Option 1: Registration Page (Recommended)**
- Visit http://localhost:3000/register
- Complete the registration form with role selection
- Password strength indicator guides secure password creation

**Option 2: Django Admin**
- Visit http://localhost:8000/admin/ (requires superuser)
- Navigate to Users section to create/manage users

**Option 3: Django Shell**
```bash
conda activate prudence
python3 manage.py shell
```
```python
from accounts.models import CustomUser
user = CustomUser.objects.create_user(
    username='testuser',
    email='test@example.com',
    password='testpass123',
    first_name='Test',
    last_name='User',
    role='L2'  # L1, L2, or L3
)
```

### User Role Permissions

| Role | Description | Permissions |
|------|-------------|-------------|
| **L1** | Risk Reporter | Can add risks (requires L2 approval), view assigned items |
| **L2** | Risk Manager | Full CRUD operations, approve L1 submissions, access assessments |
| **L3** | Risk Observer | Read-only access for compliance/audit purposes |

## Project Structure

```
prudence/
├── Backend (Django REST API)
│   ├── accounts/              # User authentication & management
│   │   ├── api_views.py       # Auth endpoints (login, register, user)
│   │   ├── serializers.py     # User data serialization
│   │   └── models.py          # CustomUser model with roles
│   ├── prudence/              # Core GRC application
│   │   ├── api_views.py       # Risk, Control, Assessment endpoints
│   │   ├── serializers.py     # Data serialization
│   │   ├── models.py          # Risk, Control, Assessment models
│   │   └── views.py           # Legacy views (removed)
│   ├── api_urls.py            # API URL configuration
│   ├── manage.py              # Django management commands
│   └── requirements.txt       # Python dependencies
│
├── Frontend (React + Tailwind)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # Header, Sidebar, Layout components
│   │   │   ├── common/        # Reusable UI components
│   │   │   ├── auth/          # Authentication components
│   │   │   ├── risk/          # Risk management components
│   │   │   └── control/       # Control management components
│   │   ├── pages/
│   │   │   ├── auth/          # Login, Register, ForgotPassword
│   │   │   ├── risk/          # Risk management pages
│   │   │   ├── control/       # Control management pages
│   │   │   └── Dashboard.tsx  # Main dashboard
│   │   ├── services/          # API integration layer
│   │   ├── contexts/          # React contexts (Auth)
│   │   ├── utils/             # Utility functions & validation
│   │   ├── types/             # TypeScript interfaces
│   │   └── assets/            # Static assets
│   ├── public/                # Public assets
│   ├── package.json           # Node.js dependencies
│   └── tailwind.config.js     # Tailwind CSS configuration
│
├── README.md                  # This file
└── CLAUDE.md                  # Claude development guide
```

## API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration  
- `GET /api/auth/user/` - Current user info
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/refresh/` - Refresh JWT token

### Risk Management
- `GET /api/risks/` - List all risks (with filtering)
- `POST /api/risks/` - Create new risk
- `GET /api/risks/{id}/` - Get risk details
- `PUT /api/risks/{id}/` - Update risk
- `DELETE /api/risks/{id}/` - Delete risk
- `GET /api/risks/matrix/` - Risk matrix visualization data
- `GET /api/risks/my-risks/` - User's assigned risks

### Control Management
- `GET /api/controls/` - List all controls
- `POST /api/controls/` - Create new control
- `GET /api/controls/{id}/` - Get control details
- `PUT /api/controls/{id}/` - Update control
- `DELETE /api/controls/{id}/` - Delete control
- `GET /api/controls/my-controls/` - User's assigned controls

### Assessment & Dashboard
- `GET /api/risk-assessments/` - List risk assessments
- `PATCH /api/risk-assessments/{id}/` - Update assessment status
- `GET /api/dashboard/stats/` - Dashboard statistics

## Development Workflow

### Running Both Servers Simultaneously

**Terminal 1 - Django Backend:**
```bash
conda activate prudence
cd /path/to/prudence
python3 manage.py runserver
```

**Terminal 2 - React Frontend:**
```bash
cd /path/to/prudence/frontend
npm start
```

### Building for Production

**Frontend Build:**
```bash
cd frontend
npm run build
```

**Django Production Settings:**
- Set `DEBUG = False` in settings.py
- Update `ALLOWED_HOSTS` for your domain
- Configure production database (PostgreSQL recommended)
- Set up static file serving

## Design System

### Color Palette
- **Primary**: Blue (#3b82f6) - Trust, reliability
- **Secondary**: Gray (#64748b) - Professional, neutral
- **Accent**: Amber (#f59e0b) - Attention, warnings
- **Success**: Green (#22c55e) - Positive actions
- **Warning**: Orange (#f97316) - Caution
- **Danger**: Red (#ef4444) - Critical issues

### Typography
- **Font Family**: Inter (Google Fonts)
- **Hierarchy**: Clear heading, subheading, and body text structure
- **Weight**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

### Components
- **Glass Morphism**: Translucent backgrounds with blur effects
- **Neumorphism**: Subtle 3D effects for modern touch
- **Animations**: Smooth transitions using Framer Motion
- **Responsive**: Mobile-first design approach

## Troubleshooting

### Common Issues

**Port 8000 already in use:**
```bash
lsof -ti:8000 | xargs kill -9
python3 manage.py runserver
```

**Port 3000 already in use:**
```bash
lsof -ti:3000 | xargs kill -9
npm start
```

**React dependencies issues:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

**Database issues:**
```bash
conda activate prudence
rm db.sqlite3
python3 manage.py migrate
```

**CORS issues:**
Ensure both servers are running on correct ports:
- Django: http://localhost:8000
- React: http://localhost:3000

### Environment Configuration

**Frontend (.env file):**
```
REACT_APP_API_URL=http://localhost:8000/api
GENERATE_SOURCEMAP=false
```

**Backend (settings.py):**
- `DEBUG = True` for development
- `CORS_ALLOW_ALL_ORIGINS = True` for development
- Proper CORS_ALLOWED_ORIGINS for production

## Deployment

### Production Checklist
- [ ] Set `DEBUG = False` in Django settings
- [ ] Configure production database
- [ ] Set up proper CORS origins
- [ ] Build React app (`npm run build`)
- [ ] Configure static file serving
- [ ] Set up SSL certificates
- [ ] Configure environment variables
- [ ] Set up monitoring and logging

### Recommended Hosting
- **Backend**: Heroku, DigitalOcean, AWS
- **Frontend**: Netlify, Vercel, AWS S3 + CloudFront
- **Database**: PostgreSQL (Heroku Postgres, AWS RDS)

## Support & Contact

For more information and support:
- **Email**: jpmonck@me.com
- **Project**: Prudence Risk Management System
- **License**: [Add your license here]

## Future Enhancements

### Planned Features
- [ ] Advanced reporting and analytics
- [ ] Third-party risk management
- [ ] Cybersecurity risk modules
- [ ] Business continuity planning
- [ ] Compliance framework templates
- [ ] Mobile application
- [ ] API integrations
- [ ] Advanced user management
- [ ] Training and awareness modules
- [ ] Audit management system

### Technology Roadmap
- [ ] Real-time notifications
- [ ] Advanced data visualization
- [ ] Machine learning risk scoring
- [ ] Integration with external APIs
- [ ] Multi-tenancy support
- [ ] Advanced security features

---

## Getting Started Now

1. **Clone and setup** following the Quick Start Guide above
2. **Register your first user** at http://localhost:3000/register
3. **Create sample risks** to explore the system
4. **Test role-based features** with different user types
5. **Explore the professional GRC menu** structure

Your enterprise-grade risk management platform is ready to use!

---

*Built using Django REST Framework, React, TypeScript, and Tailwind CSS*