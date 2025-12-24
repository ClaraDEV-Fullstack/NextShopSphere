🛒 NextShopSphere

A modern, full-stack e-commerce platform built with Next.js and Django REST Framework, featuring secure authentication, Cloudinary image uploads, and advanced shopping functionalities.












📋 Table of Contents

Features

Tech Stack

Project Structure

Prerequisites

Installation

Environment Variables

Running the Application

API Documentation

Deployment

Testing

Contributing

Author

License

✨ Features
🛍️ Shopping Experience

Product browsing with categories and filters

Advanced search functionality

Product details with image galleries

Related products suggestions

Featured, bestseller, and on-sale sections

👤 User Management

User registration and authentication

JWT-based secure authentication

Google OAuth integration

Profile management and profile picture upload

🛒 Cart & Orders

Shopping cart functionality

Order placement and tracking

Order history and cancellation

❤️ Wishlist

Add/remove products to wishlist

Wishlist management

⭐ Reviews & Ratings

Product reviews and ratings

Rating statistics and moderation

💳 Payments

Secure payment processing

Payment history

🔔 Alerts

User notifications

Alert management

🌐 Cloud & Media

Cloudinary integration for product images

Automatic handling of multiple product images

Efficient storage and delivery of media assets

🛠️ Tech Stack
Frontend
Technology	Version	Purpose
React	19.2.1	UI Framework
Redux Toolkit	2.11.1	State Management
React Router DOM	7.10.1	Routing
Axios	1.13.2	HTTP Client
Tailwind CSS	3.4.18	Styling
Framer Motion	12.23.26	Animations
React Hot Toast	2.6.0	Notifications
React Icons	5.5.0	Icon Library
Cloudinary React SDK	2.9.0	Image Rendering
Backend
Technology	Version	Purpose
Django	6.0	Web Framework
Django REST Framework	3.16.1	REST API
SimpleJWT	5.5.1	JWT Authentication
DRF Spectacular	0.29.0	API Documentation
Gunicorn	21.2.0	Production Server
WhiteNoise	6.11.0	Static Files
Pillow	12.0.0	Image Processing
Cloudinary Python SDK	1.34.0	Media Uploads
python-dotenv	1.2.1	Environment Variables
Database
Technology	Version	Purpose
MySQL	8.0	Primary Database
PyMySQL	1.1.2	MySQL Connector
DevOps & Deployment
Technology	Purpose
Docker	Containerization
Docker Compose	Multi-container orchestration
Nginx	Reverse proxy and static file serving
Bash	Deployment scripts automation
📁 Project Structure
NextShopSphere/
├── backend/              # Django backend
│   ├── accounts/         # User authentication & profiles
│   ├── products/         # Product management
│   ├── orders/           # Order processing
│   ├── payments/         # Payment handling
│   ├── reviews/          # Product reviews
│   ├── wishlist/         # User wishlists
│   ├── alerts/           # Notifications
│   ├── nextshopsphere/   # Django settings
│   ├── Dockerfile        # Development Dockerfile
│   ├── Dockerfile.prod   # Production Dockerfile
│   └── requirements.txt  # Python dependencies
│
├── frontend/             # React frontend
│   ├── src/
│   │   ├── api/          # API configuration
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── redux/        # Redux store & slices
│   │   └── App.js        # Main App component
│   ├── Dockerfile        # Development Dockerfile
│   ├── Dockerfile.prod   # Production Dockerfile
│   └── nginx.conf        # Nginx configuration
│
├── nginx/                # Nginx Reverse Proxy
│   └── nginx.conf        # Main config
│
├── docker-compose.yml    # Development Docker Compose
├── docker-compose.prod.yml # Production Docker Compose
├── deploy.sh             # Deployment script
└── README.md             # Documentation

📋 Prerequisites

Node.js >= 18.x

Python >= 3.12

MySQL >= 8.0

Docker & Docker Compose (for containerized deployment)

Git

🚀 Installation
1. Clone the Repository
   git clone https://github.com/yourusername/NextShopSphere.git
   cd NextShopSphere/Next_Shop_Sphere

2. Backend Setup
   cd backend
   python -m venv venv

# Activate venv
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt

# Copy and edit environment file
cp .env.example .env

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

3. Frontend Setup
   cd frontend
   npm install

# Copy and edit environment file
cp .env.example .env

npm start

🔐 Environment Variables
Backend (backend/.env)
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
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

Frontend (frontend/.env)
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id

🏃 Running the Application
Option 1: Local Development
# Backend
cd backend
.\venv\Scripts\activate
python manage.py runserver

# Frontend
cd frontend
npm start


Access:
Frontend: http://localhost:3000
Backend API: http://localhost:8000/api
Admin Panel: http://localhost:8000/admin

Option 2: Docker Development
docker-compose up --build
docker-compose down

Option 3: Docker Production
cp .env.example .env.production
# Edit with production values
chmod +x deploy.sh
./deploy.sh

📚 API Documentation

Available via Swagger UI:

Development: http://localhost:8000/api/docs/

Schema: http://localhost:8000/api/schema/

Main Endpoints:

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
🧪 Testing
# Backend tests
cd backend
python manage.py test

# Frontend tests
cd frontend
npm test

📝 Contributing

Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add AmazingFeature')

Push to branch (git push origin feature/AmazingFeature)

Open a Pull Request

👨‍💻 Author

ClaraDEV-Fullstack

GitHub: @ClaraDEV-Fullstack

LinkedIn: Clara Beri

Portfolio: https://claradev.vercel.app/

📄 License

This project is licensed under the MIT License – see the LICENSE file for details.

🙏 Acknowledgments

Django REST Framework team

React team

Cloudinary team

All open-source contributors

<p align="center">Made with ❤️ by the NextShopSphere Team</p>
