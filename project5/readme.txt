Prudence Governance Risk and Compliance (GRC) Platform

Project Overview
Prudence is a web-based Governance, Risk, and Compliance (GRC) platform designed to assist organizations in identifying, assessing, and mitigating risks. 
This system leverages Django as its backend framework and JavaScript for dynamic front-end interactions, ensuring a responsive and intuitive user experience. 
Prudence provides comprehensive tools for managing risks and controls, evaluating inherent and residual risks, monitoring control effectiveness, and ensuring 
compliance with ISO 31000 standards.


Features
Risk Management: Users can add, edit, and view risks along with their inherent and residual attributes. Each risk can be assigned to an owner and linked to multiple controls.
Control Management: Users can add, edit, and manage controls that mitigate associated risks. Controls are evaluated for effectiveness and assigned to owners.
Risk Assessment Matrix: Visual representation of risks on a 5x5 matrix, following ISO 31000 standards. This matrix helps in understanding the impact and probability of risks.
User Authentication: Secure login and registration system to manage user access and permissions, ensuring data privacy and integrity.
Assigned Items Dashboard: Users can view risks and controls specifically assigned to them, facilitating personalized risk management.
Interactive Visualization: JavaScript-powered interactive charts and graphs for risk assessments, making data interpretation intuitive and efficient.
Responsive Design: The application is fully responsive and functions seamlessly across various devices and screen sizes.


Technology Stack
Backend: Django (Python) for handling server-side logic and database interactions.
Frontend: JavaScript (Chart.js for visualizations), HTML, and CSS for building the user interface.
Database: SQLite for development purposes.
Styling: Bootstrap and custom CSS for responsive and aesthetic UI design.


Files Structure
manage.py: Entry point for executing Django commands.
requirements.txt: Lists all necessary Python packages for the project.
db.sqlite3: Database file where all data is stored.
prudence/: Main application directory.
models.py: Defines data models for Risk, Control, and User.
views.py: Handles the request-response cycle for the application.
urls.py: URL declarations for the application.
forms.py: Forms for Risk and Control data entry.
templatetags/risk_filters.py: Custom template filters for displaying descriptive risk levels.
templates/: Contains HTML templates for the application.
base.html: Base template including the navigation bar and site layout.
risk_list.html: Displays a list of all risks with detailed attributes.
control_list.html: Displays a list of all controls with details.
add_risk.html: Form for adding a new risk.
edit_risk.html: Form for editing existing risks.
add_control.html: Form for adding a new control.
edit_control.html: Form for editing existing controls.
risk_register.html: Displays risk assessments and visualizations.
static/: Directory for static files like CSS and JavaScript.
css/: Contains CSS files.
styles.css: Styling for the entire application.


Installation
To run Prudence locally, follow these steps:
1. Clone the repository:
  git clone https://github.com/jpmonck/prudence/README.md
2. Navigate to the project directory; 
  cd project5
3. Install required packages
  pip install -r requirements.txt
4. Run migrations to set up the database
  python manage.py makemigrations
  python manage.py migrate
5. Start the development server
  python manage.py runserver
6. Open a web browser and navigate to http://127.0.0.1:8000/ to start using the application


Video Demonstration
Watch a detailed walkthrough of the Prudence Risk Management System here https://youtu.be/znXIDSAMDHM.


Design Decisions
Django Framework: Chosen for its robust architecture and ease of scaling for future enhancements.
JavaScript Integration: Utilized for creating interactive visualizations and enhancing user interactivity.
Bootstrap: Utilized for responsive design elements to ensure the application is mobile-friendly.
SQLite Database: Used for development due to its simplicity and ease of integration with Django.


Future Enhancements
Integration with External APIs: To enable real-time risk data analysis.
Advanced Reporting: Enhanced reporting features for detailed risk analysis.
Role-based Access Control: To enforce granular permissions and access management.


Contact Information
For more information, contact JP Monck at jpmonck@me.com.