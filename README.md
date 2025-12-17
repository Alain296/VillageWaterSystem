# Village Water System

A modern, professional full-stack web application to automate water usage tracking and billing for village communities in Rwanda, replacing manual pen-and-paper systems.

## 🚀 Technology Stack

- **Frontend**: React.js 18 with modern UI design
- **Backend**: Django 4.2 with REST Framework
- **Database**: MySQL 8.0
- **Authentication**: JWT (JSON Web Tokens)
- **Charts**: Chart.js for data visualization

## ✨ Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Manager, Household)
- Secure password hashing
- Session persistence with token refresh

### Household Management
- CRUD operations for households
- Auto-generated household codes (HH-YYYY-####)
- Comprehensive validation (email, phone, national ID)
- Search and filter functionality

### Water Usage Tracking
- Record meter readings
- Auto-calculate liters used
- Prevent duplicate entries per household/month
- Validation: current >= previous reading

### Billing System
- Auto-generate bills for households
- Calculate: liters × rate
- Apply penalties and discounts
- Auto-update bill status on payment

### Payment Processing
- Multiple payment methods (Cash, Mobile Money, Bank Transfer)
- Auto-generate receipt numbers (RCP-YYYY-MM-####)
- Track payment history
- Validate payment amounts

### Dashboard & Analytics
- Real-time statistics
- Revenue trend charts
- Bill status distribution
- Top water consumers
- Recent activity tracking

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Node.js 16+** and npm - [Download](https://nodejs.org/)
- **MySQL 8.0** - [Download](https://dev.mysql.com/downloads/)
- **Visual Studio Code** - [Download](https://code.visualstudio.com/)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
cd d:\Desktop\VillageWaterSystem
```

### 2. Database Setup

1. Open **MySQL 8.0 Command Line Client**
2. Enter your MySQL root password
3. Run the database schema:

```bash
source d:/Desktop/VillageWaterSystem/database/schema.sql
```

Or manually execute:

```sql
mysql -u root -p < d:/Desktop/VillageWaterSystem/database/schema.sql
```

### 3. Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Create a virtual environment:

```bash
python -m venv venv
```

3. Activate the virtual environment:

```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. Install Python dependencies:

```bash
pip install -r requirements.txt
```

5. Update MySQL password in `VillageWaterSystem/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'village_water_system',
        'USER': 'root',
        'PASSWORD': 'YOUR_MYSQL_PASSWORD',  # Update this
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

6. Run Django migrations:

```bash
python manage.py migrate
```

7. Start the Django development server:

```bash
python manage.py runserver 8000
```

Backend will be available at: **http://localhost:8000**

### 4. Frontend Setup

1. Open a new terminal and navigate to frontend directory:

```bash
cd d:\Desktop\VillageWaterSystem\frontend
```

2. Install Node.js dependencies:

```bash
npm install
```

3. Start the React development server:

```bash
npm start
```

Frontend will be available at: **http://localhost:3000**

## 🔐 Default Credentials

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`

### Manager Account
- **Username**: `manager1`
- **Password**: `manager123`

## 📱 Usage Guide

### For Admin/Manager:

1. **Login** with admin or manager credentials
2. **Dashboard** - View statistics and charts
3. **Households** - Add and manage household registrations
4. **Usage** - Record water meter readings
5. **Billing** - Generate bills for households
6. **Payments** - Process and track payments

### For Household Users:

1. **Register** a new household account
2. **Login** with your credentials
3. **Dashboard** - View your water usage and bills
4. **Payments** - View payment history
5. **Profile** - Manage your account

## 🗂️ Project Structure

```
VillageWaterSystem/
├── frontend/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # Auth context
│   │   ├── services/        # API services
│   │   ├── styles/          # CSS files
│   │   ├── App.js           # Main app component
│   │   └── index.js         # Entry point
│   └── package.json
├── backend/                  # Django backend
│   ├── VillageWaterSystem/  # Django project
│   ├── api/                 # API app
│   │   ├── models.py        # Database models
│   │   ├── serializers.py   # DRF serializers
│   │   ├── views.py         # API views
│   │   ├── urls.py          # API routes
│   │   └── permissions.py   # Custom permissions
│   ├── manage.py
│   └── requirements.txt
├── database/
│   └── schema.sql           # MySQL database schema
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/logout/` - Logout user
- `GET /api/auth/user/` - Get current user

### Households
- `GET /api/households/` - List all households
- `POST /api/households/` - Create household
- `PUT /api/households/:id/` - Update household
- `DELETE /api/households/:id/` - Delete household

### Water Usage
- `GET /api/usage/` - List usage records
- `POST /api/usage/` - Create usage record
- `PUT /api/usage/:id/` - Update usage record
- `DELETE /api/usage/:id/` - Delete usage record

### Bills
- `GET /api/bills/` - List bills
- `POST /api/bills/generate_bills/` - Generate bills
- `PUT /api/bills/:id/` - Update bill
- `DELETE /api/bills/:id/` - Delete bill

### Payments
- `GET /api/payments/` - List payments
- `POST /api/payments/` - Create payment
- `PUT /api/payments/:id/` - Update payment

### Dashboard
- `GET /api/dashboard/stats/` - Get statistics
- `GET /api/dashboard/charts/` - Get chart data

## 🧪 Testing

### Test Authentication
1. Register a new user
2. Login with credentials
3. Verify JWT token is stored
4. Test protected routes

### Test CRUD Operations
1. Create a household
2. Record water usage
3. Generate bills
4. Process payments

### Test Validations
- Duplicate usage prevention
- Payment amount validation
- Bill calculation accuracy
- Role-based access control

## 🎨 UI Features

- **Modern Design**: Professional color scheme with gradients
- **Responsive**: Works on desktop, tablet, and mobile
- **Animations**: Smooth transitions and hover effects
- **Charts**: Interactive data visualizations
- **Toast Notifications**: Real-time feedback
- **Modal Forms**: Clean data entry interface

## 🔒 Security Features

- Password hashing with Django's built-in system
- JWT token authentication
- CORS protection
- Input validation
- SQL injection prevention
- XSS protection

## 📊 Database Schema

- **users** - User accounts with roles
- **households** - Household registrations
- **water_usage** - Meter readings
- **tariff_rates** - Pricing information
- **bills** - Generated bills
- **payments** - Payment records

## 🐛 Troubleshooting

### Backend Issues

**Error: No module named 'mysqlclient'**
```bash
pip install mysqlclient
```

**Error: Access denied for user**
- Update MySQL password in `settings.py`
- Ensure MySQL server is running

### Frontend Issues

**Error: Cannot find module**
```bash
cd frontend
npm install
```

**Error: Port 3000 already in use**
```bash
# Kill the process or use a different port
set PORT=3001 && npm start
```

## 📝 License

This project is created for educational purposes.

## 👥 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Contact the development team

## 🚀 Deployment

For production deployment:
1. Set `DEBUG = False` in Django settings
2. Configure proper SECRET_KEY
3. Set up production database
4. Build React app: `npm run build`
5. Configure web server (Nginx/Apache)
6. Set up SSL certificates

---

**Built with ❤️ for Village Communities in Rwanda**
