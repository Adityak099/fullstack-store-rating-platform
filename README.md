# 🏪 Store Rating Platform

A comprehensive full-stack web application for managing stores and ratings with role-based access control. Built with modern technologies and featuring a complete admin dashboard, store owner management, and user rating system.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ System Architecture](#️-system-architecture)
- [🚀 Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [🎮 Usage](#-usage)
- [👥 User Roles](#-user-roles)
- [🔐 Authentication](#-authentication)
- [📚 API Documentation](#-api-documentation)
- [🏛️ Database Schema](#️-database-schema)
- [🔧 Tech Stack](#-tech-stack)
- [📂 Project Structure](#-project-structure)
- [🛡️ Security](#️-security)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Features

### 🎯 Core Functionality
- **Multi-role Authentication System** - Secure login for Admins, Store Owners, and Users
- **Store Management** - Complete CRUD operations for stores
- **Rating System** - Users can rate and review stores
- **Advanced Search & Filtering** - Filter by name, email, address, role, and status
- **Real-time Dashboard** - Statistics and insights for all user types

### 👑 System Administrator Features
- **User Management**
  - View all users with detailed information (Name, Email, Address, Role)
  - Create new users with any role (Admin, Store Owner, User)
  - Advanced filtering by Name, Email, Address, and Role
  - User details modal with store owner rating information
- **Store Management**
  - View all stores with comprehensive details (Name, Owner Email, Address, Rating)
  - Create new stores and assign to available store owners
  - Filter stores by all criteria including status
  - Store details modal with complete information
- **Dashboard Analytics**
  - Total users, stores, and ratings statistics
  - User distribution by role
  - Recent activity tracking
  - Quick action buttons for management tasks

### 🏪 Store Owner Features
- **Store Dashboard** - Manage own store information and view ratings
- **Profile Management** - Update personal information and password
- **Rating Insights** - View customer feedback and average ratings

### 👤 User Features
- **Store Discovery** - Browse and search available stores
- **Rating & Reviews** - Rate stores and leave feedback
- **Profile Management** - Update personal information and password

### 🔒 Security Features
- **JWT Authentication** - Secure token-based authentication
- **Role-based Access Control** - Strict permission management
- **Password Hashing** - bcrypt with 12 rounds for security
- **Protected Routes** - Frontend and backend route protection
- **Input Validation** - Comprehensive data validation

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │◄──►│  Express API    │◄──►│   PostgreSQL    │
│   (Frontend)    │    │   (Backend)     │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
       │                        │                        │
       │                        │                        │
   Tailwind CSS           JWT + bcrypt            Sequelize ORM
   React Router           Express.js              Foreign Keys
   Axios HTTP             CORS Enabled            Relationships
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd FullStack_Intern_Coding_Challenge
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
DB_NAME=store_rating_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Database Setup
```bash
# Create PostgreSQL database
createdb store_rating_db

# Start backend (creates tables automatically)
cd ../backend
npm start
```

### 5. Create Admin User
```bash
# In backend directory
node create-admin.js
```

### 6. Start Frontend
```bash
cd ../frontend
npm start
```

### 7. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Default Admin**: admin@storerating.com / admin123

## 📦 Installation

### Backend Dependencies
```bash
cd backend
npm install express
npm install sequelize pg pg-hstore
npm install bcryptjs jsonwebtoken
npm install cors helmet morgan
npm install dotenv express-validator
```

### Frontend Dependencies
```bash
cd frontend
npm install react react-dom
npm install react-router-dom
npm install axios jwt-decode
npm install tailwindcss
```

## ⚙️ Configuration

### Environment Variables

#### Backend (.env)
```env
# Database Configuration
DB_NAME=store_rating_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Database Configuration
The application uses PostgreSQL with Sequelize ORM. Tables are created automatically on first run.

## 🎮 Usage

### 1. Admin Dashboard
```
Login → Admin Dashboard → Manage Users/Stores
- View comprehensive user/store listings
- Apply advanced filters
- Create new users and stores
- View detailed analytics
```

### 2. Store Owner Portal
```
Login → Store Dashboard → Manage Store
- View store performance
- Update store information
- Monitor customer ratings
```

### 3. User Experience
```
Login/Register → Browse Stores → Rate & Review
- Discover stores
- Leave ratings and feedback
- Manage profile
```

## 👥 User Roles

### 🔴 System Administrator
- **Permissions**: Full system access
- **Capabilities**:
  - Manage all users and stores
  - View system analytics
  - Create admins, store owners, and users
  - Access all data with advanced filtering

### 🟡 Store Owner
- **Permissions**: Own store management
- **Capabilities**:
  - Manage personal store
  - View store ratings and feedback
  - Update store information
  - Profile management

### 🟢 Regular User
- **Permissions**: Basic user access
- **Capabilities**:
  - Browse and rate stores
  - Manage personal profile
  - View rating history

## 🔐 Authentication

### JWT Token Flow
```
1. User Login → Server validates credentials
2. Server generates JWT token
3. Client stores token in localStorage
4. Client sends token in Authorization header
5. Server validates token for protected routes
```

### Password Security
- bcrypt hashing with 12 rounds
- Minimum 6 character requirement
- Secure password update functionality

### Route Protection
- Frontend: ProtectedRoute component
- Backend: authenticateToken + requireRole middleware

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/login
POST /api/auth/register
```

### Admin Endpoints (Requires Admin Token)
```
GET  /api/admin/dashboard-stats    # Dashboard statistics
GET  /api/admin/users             # List all users
GET  /api/admin/users/:id         # Get user details
POST /api/admin/users             # Create new user
GET  /api/admin/stores            # List all stores
POST /api/admin/stores            # Create new store
GET  /api/admin/store-owners      # Available store owners
```

### User Endpoints (Requires Auth Token)
```
GET  /api/user/dashboard          # User dashboard
GET  /api/user/stores             # Browse stores
POST /api/user/update-password    # Update password
```

### Store Owner Endpoints (Requires Store Owner Token)
```
GET  /api/store-owner/dashboard   # Store owner dashboard
POST /api/store-owner/update-password
```

### Rating Endpoints
```
GET  /api/ratings/store/:id       # Get store ratings
POST /api/ratings                 # Create rating
```

## 🏛️ Database Schema

### Users Table
```sql
- id (Primary Key)
- name (String, Required)
- email (String, Unique, Required)
- password (String, Hashed, Required)
- address (String, Optional)
- role (Enum: 'admin', 'store_owner', 'user')
- createdAt, updatedAt
```

### Stores Table
```sql
- id (Primary Key)
- name (String, Required)
- description (Text, Optional)
- address (String, Optional)
- phone (String, Optional)
- category (String, Optional)
- isActive (Boolean, Default: true)
- ownerId (Foreign Key → Users.id)
- createdAt, updatedAt
```

### Ratings Table
```sql
- id (Primary Key)
- rating (Integer, 1-5, Required)
- comment (Text, Optional)
- userId (Foreign Key → Users.id)
- storeId (Foreign Key → Stores.id)
- createdAt, updatedAt
```

### Relationships
- User → Store (One-to-One: Store Owner)
- User → Ratings (One-to-Many: User can rate multiple stores)
- Store → Ratings (One-to-Many: Store can have multiple ratings)

## 🔧 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator
- **Security**: helmet, cors

### Frontend
- **Library**: React 19
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Build Tool**: Create React App

### Development Tools
- **Process Manager**: nodemon
- **Environment**: dotenv
- **Version Control**: Git

## 📂 Project Structure

```
FullStack_Intern_Coding_Challenge/
├── backend/
│   ├── config/
│   │   └── db.config.js          # Database configuration
│   ├── controllers/
│   │   ├── adminController.js    # Admin operations
│   │   ├── authController.js     # Authentication
│   │   ├── userController.js     # User operations
│   │   ├── storeOwnerController.js
│   │   └── ratingController.js
│   ├── middlewares/
│   │   ├── auth.js              # JWT authentication
│   │   └── errorHandler.js      # Error handling
│   ├── models/
│   │   ├── index.js             # Database connection
│   │   ├── user.model.js        # User model
│   │   ├── store.model.js       # Store model
│   │   └── rating.model.js      # Rating model
│   ├── routes/
│   │   ├── admin.routes.js      # Admin routes
│   │   ├── auth.routes.js       # Auth routes
│   │   ├── user.routes.js       # User routes
│   │   ├── storeOwner.routes.js
│   │   └── rating.routes.js
│   ├── utils/
│   │   └── apiResponse.js       # Response utilities
│   ├── create-admin.js          # Admin creation script
│   ├── create-new-admin.js      # Interactive admin creation
│   ├── app.js                   # Express app setup
│   ├── server.js               # Server entry point
│   └── package.json
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── manifest.json
│   ├── src/
│   │   ├── api/
│   │   │   ├── admin.js         # Admin API calls
│   │   │   ├── auth.js          # Auth API calls
│   │   │   ├── user.js          # User API calls
│   │   │   └── storeOwner.js    # Store owner API calls
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.js
│   │   │   │   ├── UsersList.js
│   │   │   │   ├── StoresList.js
│   │   │   │   ├── CreateUserModal.js
│   │   │   │   └── CreateStoreModal.js
│   │   │   ├── auth/
│   │   │   │   ├── Login.js
│   │   │   │   └── Register.js
│   │   │   ├── common/
│   │   │   │   ├── Header.js
│   │   │   │   ├── ProtectedRoute.js
│   │   │   │   └── RatingInput.js
│   │   │   ├── user/
│   │   │   │   ├── Dashboard.js
│   │   │   │   ├── StoresList.js
│   │   │   │   └── UpdatePassword.js
│   │   │   └── storeOwner/
│   │   │       ├── Dashboard.js
│   │   │       └── UpdatePassword.js
│   │   ├── context/
│   │   │   └── AuthContext.js   # Authentication context
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   └── NotFound.js
│   │   ├── App.js              # Main app component
│   │   ├── App.css             # Global styles
│   │   └── index.js            # React entry point
│   ├── tailwind.config.js      # Tailwind configuration
│   ├── postcss.config.js       # PostCSS configuration
│   └── package.json
└── README.md
```

## 🛡️ Security

### Implemented Security Measures

1. **Authentication & Authorization**
   - JWT tokens with expiration
   - Role-based access control
   - Protected routes on frontend and backend

2. **Password Security**
   - bcrypt hashing (12 rounds)
   - Password strength requirements
   - Secure password update process

3. **API Security**
   - CORS enabled for cross-origin requests
   - Helmet.js for security headers
   - Input validation and sanitization
   - SQL injection prevention via Sequelize ORM

4. **Frontend Security**
   - Token storage in localStorage
   - Automatic token validation
   - Route-level permission checking

### Security Best Practices
- Environment variables for sensitive data
- No sensitive information in client-side code
- Proper error handling without data leakage
- Request rate limiting (recommended for production)

## 🧪 Testing

### Manual Testing
The application has been thoroughly tested for:
- User authentication and authorization
- CRUD operations for all entities
- Role-based access control
- API security measures
- Frontend-backend integration

### Test Scenarios Covered
- ✅ Admin login and dashboard access
- ✅ User registration and login
- ✅ Store creation and management
- ✅ Rating system functionality
- ✅ Security middleware protection
- ✅ Data validation and error handling

## 🚀 Deployment

### Production Checklist

#### Backend Deployment
1. Set production environment variables
2. Configure production database
3. Enable HTTPS
4. Set up process manager (PM2)
5. Configure reverse proxy (Nginx)

#### Frontend Deployment
1. Build production bundle: `npm run build`
2. Deploy to static hosting (Netlify, Vercel)
3. Configure environment variables
4. Set up CI/CD pipeline

#### Environment Setup
```bash
# Production environment variables
NODE_ENV=production
DB_HOST=production_db_host
JWT_SECRET=super_secure_production_secret
```

### Recommended Hosting
- **Backend**: Heroku, AWS EC2, Digital Ocean
- **Frontend**: Netlify, Vercel, AWS S3
- **Database**: AWS RDS, Heroku Postgres

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and test thoroughly
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open Pull Request

### Code Standards
- Follow ESLint configuration
- Use meaningful commit messages
- Add comments for complex logic
- Maintain consistent naming conventions

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For support, email [kraditya.1222@gmail.com] or create an issue in the repository.

## 🙏 Acknowledgments

- Express.js team for the robust backend framework
- React team for the powerful frontend library
- Sequelize team for the excellent ORM
- Tailwind CSS for beautiful styling utilities

---

**Built with ❤️ by Aditya**

*A full-stack store rating platform demonstrating modern web development practices and secure authentication systems.*
