# 🚀 Beginner Setup Guide - Village Water System

This guide will help you set up the project manually step-by-step. Follow each section in order.

---

## ✅ Prerequisites Check

Your system has:
- ✅ **Python 3.14.0** (Required: 3.8+)
- ✅ **Node.js 24.14.0** (Required: 16+)  
- ✅ **npm 11.9.0**
- ✅ **MySQL 80** (Running on port 3306)

---

## 📋 Step-by-Step Setup

### **PHASE 1: DATABASE SETUP** (5 minutes)

#### Step 1.1: Open PowerShell
- Press `Win + X`, then select "PowerShell" or search for PowerShell

#### Step 1.2: Navigate to Backend
```powershell
cd d:\Desktop\VillageWaterSystem\backend
```

#### Step 1.3: Create Database & Tables
```powershell
mysql -u root -pChemistry77+ < ..\database\schema.sql
```
**What this does:** Creates the MySQL database and all tables needed for the application.

**Expected status:** No error messages = Success ✅

---

### **PHASE 2: BACKEND SETUP** (15 minutes)

#### Step 2.1: Create Virtual Environment

```powershell
python -m venv venv
```

**What this does:** Creates an isolated Python environment for the backend. This keeps project dependencies separate from your system.

**Expected status:** A new `venv` folder appears ✅

#### Step 2.2: Activate Virtual Environment

```powershell
.\venv\Scripts\Activate.ps1
```

**What this does:** Activates the Python environment. Your prompt should show `(venv)` at the start.

**Expected output:**
```
(venv) PS D:\Desktop\VillageWaterSystem\backend>
```

#### Step 2.3: Install Dependencies

```powershell
pip install -r requirements.txt
```

**What this does:** Installs all required Python packages (Django, Django REST Framework, JWT, MySQL client, etc.)

**Expected status:** Completes without errors and shows "Successfully installed..." messages ✅

**⏱️ This may take 2-3 minutes - please be patient!**

#### Step 2.4: Verify Installation

```powershell
python -c "import django; print(f'Django version: {django.get_version()}')"
```

**Expected output:**
```
Django version: 4.2.7
```

#### Step 2.5: Run Database Migrations

```powershell
python manage.py migrate
```

**What this does:** Applies Django ORM migrations to the MySQL database, creating any additional `tables needed.

**Expected status:** Shows "Running migrations..." and completes without errors ✅

#### Step 2.6: Create Admin User (Optional but Recommended)

```powershell
python manage.py createsuperuser
```

**Instructions:**
- Username: `admin` (or your choice)
- Email: `admin@example.com`
- Password: `Admin@123` (or your choice - must be 8+ characters)
- Confirm password: Repeat the password

#### Step 2.7: Start Django Development Server

```powershell
python manage.py runserver 8000
```

**Expected output:**
```
Starting development server at http://127.0.0.1:8000/
```

**✅ Backend is now running!**

**In your browser, visit:**
- Homepage: http://localhost:8000/
- API: http://localhost:8000/api/
- Admin Panel: http://localhost:8000/admin/

---

### **PHASE 3: FRONTEND SETUP** (15 minutes)

#### Step 3.1: Open NEW PowerShell Terminal

⚠️ **IMPORTANT:** Do NOT close the first terminal (backend server must keep running)!

**Open a new PowerShell:**
- Press `Win + X`, select "PowerShell" again
- OR use VS Code's integrated terminal: `Ctrl + Backtick`

#### Step 3.2: Navigate to Frontend

```powershell
cd d:\Desktop\VillageWaterSystem\frontend
```

#### Step 3.3: Install Frontend Dependencies

```powershell
npm install
```

**What this does:** Installs all React packages and dependencies.

**Expected status:** Completes with no severe errors ✅

**⏱️ This may take 2-3 minutes - please be patient!**

#### Step 3.4: Start Frontend Development Server

```powershell
npm start
```

**Expected output:** Browser automatically opens to http://localhost:3000

**✅ Frontend is now running!**

---

## 🎉 Success! Your Project is Running!

You should now have:

| Service | URL | Status |
|---------|-----|--------|
| React Frontend | http://localhost:3000 | Running (in browser) |
| Django Backend | http://localhost:8000 | Running (in terminal 1) |
| MySQL Database | localhost:3306 | Running |
| Admin Panel | http://localhost:8000/admin | Running |

---

## 📝 Testing Your Setup

### Test 1: Check Backend API
```powershell
# In terminal 1, you should see requests logged:
[03/Apr/2026 15:45:23] "GET /api/ HTTP/1.1" 200
```

### Test 2: Login to Frontend
1. Go to http://localhost:3000
2. Use superuser credentials you created:
   - Username: `admin`
   - Password: `Admin@123` (or your choice)
3. You should see the Dashboard

### Test 3: Access Admin Panel
1. Go to http://localhost:8000/admin
2. Login with superuser credentials
3. You should see Django admin interface

---

## 🆘 Troubleshooting

### Issue: "MySQL Connection Error"
**Solution:** Make sure MySQL service is running:
```powershell
Get-Service MySQL80  # Should show "Running"
```

### Issue: "Port 3000 already in use"
**Solution:** Change the port:
```powershell
npm start -- --port 3001
```

### Issue: "Port 8000 already in use"  
**Solution:** Change the port:
```powershell
python manage.py runserver 8001
```

### Issue: "pip install fails"
**Solution:** Try upgrading pip first:
```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Issue: "ModuleNotFoundError: No module named 'Django'"
**Solution:** Make sure virtual environment is activated:
```powershell
# Should show (venv) in your prompt
.\venv\Scripts\Activate.ps1
```

### Issue: "npm ERR! code ERESOLVE"
**Solution:** Try forcing resolution:
```powershell
npm install --legacy-peer-deps
```

---

## 📚 Understanding the Project Structure

```
VillageWaterSystem/
├── backend/                    # Django REST API
│   ├── manage.py              # Django CLI
│   ├── requirements.txt        # Python dependencies
│   ├── venv/                  # Virtual environment (auto-created)
│   ├── VillageWaterSystem/    # Django project config
│   │   ├── settings.py        # Configuration
│   │   ├── urls.py            # API routes
│   │   ├── asgi.py/wsgi.py   # Server config
│   └── api/                   # Main app
│       ├── models.py          # Database models
│       ├── views.py           # API endpoints
│       ├── serializers.py     # Data validation
│       ├── permissions.py     # Access control
│
├── frontend/                  # React web interface
│   ├── package.json           # Node dependencies
│   ├── node_modules/          # Dependencies (auto-created)
│   ├── public/               # Static files
│   └── src/                  # React components
│       ├── components/       # UI Components
│       ├── pages/           # Page Components
│       ├── App.js           # Main app component
│
└── database/                 # SQL scripts
    └── schema.sql           # Database schema
```

---

## 🔄 Common Workflow

### Daily Development (2 terminals):

**Terminal 1 - Backend:**
```powershell
cd d:\Desktop\VillageWaterSystem\backend
.\venv\Scripts\Activate.ps1
python manage.py runserver 8000
```

**Terminal 2 - Frontend:**
```powershell
cd d:\Desktop\VillageWaterSystem\frontend
npm start
```

Then access your app at **http://localhost:3000**

---

## 📞 Quick Help Commands

```powershell
# Check Python version
python --version

# Check Node version
node --version

# Activate virtual environment
cd backend && .\venv\Scripts\Activate.ps1

# Stop Django server
Ctrl + C  (in terminal)

# Stop npm server
Ctrl + C  (in terminal)

# Create Django superuser
python manage.py createsuperuser

# Access database
mysql -u root -pChemistry77+

# Run tests
python manage.py test
```

---

## 🎯 Next Steps

Once you have everything running:

1. **Learn the API**: Visit http://localhost:8000/api/ and explore endpoints
2. **Test the Dashboard**: Access http://localhost:3000 and navigate around
3. **Review Code**: Check `backend/api/models.py` to understand data structure
4. **Make Changes**: Edit React components in `frontend/src/` - changes auto-reload!
5. **Debug**: Use Django admin at http://localhost:8000/admin/

---

## ✅ Checklist

- [ ] All prerequisites installed (Python, Node, MySQL)
- [ ] MySQL database created
- [ ] Django backend running on :8000
- [ ] React frontend running on :3000
- [ ] Can login to frontend
- [ ] Can access Django admin panel
- [ ] Both terminals open (backend + frontend)

**Congratulations! Your setup is complete!** 🎉

