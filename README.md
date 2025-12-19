
# 🛒 NextShopSphere

A modern, full-stack e-commerce platform built with Next.js and Django REST Framework.

![NextShopSphere](https://img.shields.io/badge/NextShopSphere-E--Commerce-blue)
![React](https://img.shields.io/badge/React-19.2.1-61DAFB?logo=react)
![Django](https://img.shields.io/badge/Django-5.1-092E20?logo=django)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🛍️ Shopping Experience
- Product browsing with categories and filters
- Advanced search functionality
- Product details with image galleries
- Related products suggestions
- Featured, bestseller, and on-sale sections

### 👤 User Management
- User registration and authentication
- JWT-based secure authentication
- Google OAuth integration
- User profile management
- Profile picture upload

### 🛒 Cart & Orders
- Shopping cart functionality
- Order placement and tracking
- Order history
- Order cancellation

### ❤️ Wishlist
- Add/remove products to wishlist
- Wishlist management

### ⭐ Reviews & Ratings
- Product reviews and ratings
- Review management
- Rating statistics

### 💳 Payments
- Secure payment processing
- Payment history

### 🔔 Alerts
- User notifications
- Alert management

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.1 | UI Framework |
| Redux Toolkit | 2.11.1 | State Management |
| React Router DOM | 7.10.1 | Routing |
| Axios | 1.13.2 | HTTP Client |
| Tailwind CSS | 3.4.18 | Styling |
| Framer Motion | 12.23.26 | Animations |
| React Hot Toast | 2.6.0 | Notifications |
| React Icons | 5.5.0 | Icon Library |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Django | 5.1.4 | Web Framework |
| Django REST Framework | 3.15.2 | REST API |
| SimpleJWT | 5.4.0 | JWT Authentication |
| DRF Spectacular | 0.28.0 | API Documentation |
| Gunicorn | 23.0.0 | Production Server |
| WhiteNoise | 6.8.2 | Static Files |
| Pillow | 11.1.0 | Image Processing |

### Database
| Technology | Version | Purpose |
|------------|---------|---------|
| MySQL | 8.0 | Primary Database |
| PyMySQL | 1.1.1 | MySQL Connector |

### DevOps
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Multi-container Orchestration |
| Nginx | Reverse Proxy & Static Files |

---

## 📁 Project Structure

NextShopSphere/
├── backend/ # Django Backend
│ ├── accounts/ # User authentication & profiles
│ ├── products/ # Product management
│ ├── orders/ # Order processing
│ ├── payments/ # Payment handling
│ ├── reviews/ # Product reviews
│ ├── wishlist/ # User wishlists
│ ├── alerts/ # Notifications
│ ├── nextshopsphere/ # Django settings
│ ├── Dockerfile # Development Dockerfile
│ ├── Dockerfile.prod # Production Dockerfile
│ └── requirements.txt # Python dependencies
│
├── frontend/ # React Frontend
│ ├── src/
│ │ ├── api/ # API configuration
│ │ ├── components/ # Reusable components
│ │ ├── pages/ # Page components
│ │ ├── redux/ # Redux store & slices
│ │ └── App.js # Main App component
│ ├── Dockerfile # Development Dockerfile
│ ├── Dockerfile.prod # Production Dockerfile
│ └── nginx.conf # Nginx configuration
│
├── nginx/ # Nginx Reverse Proxy
│ └── nginx.conf # Main Nginx config
│
├── docker-compose.yml # Development Docker Compose
├── docker-compose.prod.yml # Production Docker Compose
├── deploy.sh # Deployment script
└── README.md # This file

text

---

## 📋 Prerequisites

- **Node.js** >= 18.x
- **Python** >= 3.12
- **MySQL** >= 8.0
- **Docker** & **Docker Compose** (for containerized deployment)
- **Git**

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/NextShopSphere.git
cd NextShopSphere/Next_Shop_Sphere

2. Backend Setup
Bash

# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your values

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start server
python manage.py runserver
3. Frontend Setup
Bash

# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your values

# Start development server
npm start
🔐 Environment Variables
Backend (backend/.env)
env

SECRET_KEY=your-secret-key
DEBUG=True
DB_NAME=nextshopsphere
DB_USER=root
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=3306
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
GOOGLE_OAUTH_CLIENT_ID=your-google-client-id
GOOGLE_OAUTH_CLIENT_SECRET=your-google-client-secret
Frontend (frontend/.env)
env

REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
🏃 Running the Application
Option 1: Local Development
Bash

# Terminal 1 - Backend
cd backend
.\venv\Scripts\activate
python manage.py runserver

# Terminal 2 - Frontend
cd frontend
npm start
Access:

Frontend: http://localhost:3000
Backend API: http://localhost:8000/api
Admin Panel: http://localhost:8000/admin
Option 2: Docker Development
Bash

# Start all services
docker-compose up --build

# Stop services
docker-compose down
Access:

Frontend: http://localhost:3000
Backend API: http://localhost:8000/api
Option 3: Docker Production
Bash

# Copy and configure production environment
cp .env.example .env.production
# Edit .env.production with production values

# Deploy
./deploy.sh
# Or manually:
docker-compose -f docker-compose.prod.yml up --build -d
Access:

Application: http://localhost (port 80)
📚 API Documentation
API documentation is available via Swagger UI:

Development: http://localhost:8000/api/docs/
Schema: http://localhost:8000/api/schema/
Main API Endpoints
Endpoint	Method	Description
/api/accounts/register/	POST	User registration
/api/accounts/login/	POST	User login
/api/accounts/profile/	GET/PATCH	User profile
/api/products/	GET	List products
/api/products/{slug}/	GET	Product details
/api/categories/	GET	List categories
/api/orders/	GET/POST	User orders
/api/wishlist/	GET/POST	User wishlist
/api/reviews/	GET/POST	Product reviews
/api/health/	GET	Health check
🚀 Deployment
Recommended Platforms
Platform	Difficulty	Cost
Railway	Easy	Free tier available
Render	Easy	Free tier available
DigitalOcean	Medium	From $5/month
AWS	Advanced	Pay-as-you-go
Quick Deploy
Bash

# 1. Configure production environment
cp .env.example .env.production
nano .env.production  # Edit with production values

# 2. Run deployment script
chmod +x deploy.sh
./deploy.sh
🧪 Testing
Bash

# Backend tests
cd backend
python manage.py test

# Frontend tests
cd frontend
npm test
📝 Contributing
Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
👨‍💻 Author
ClaraDEV-Fullstack

GitHub: @ClaraDEV-Fullstack
LinkedIn: https://linkedin.com/in/clara-beri-794097217/
Portfolio: https://claradev.vercel.app/
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Django REST Framework team
React team
All open-source contributors

<p align="center"> Made with ❤️ by NextShopSphere Team </p> ```