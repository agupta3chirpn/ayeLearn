# ayeLearn - Full Stack Learning Platform

A complete full-stack learning platform with separate backend, admin panel, and frontend applications.

## 🏗️ Project Structure

```
ayeLearn/
├── backend/          # Node.js + Express + MySQL API
├── admin/           # React + TailwindCSS Admin Panel
└── frontend/        # React + TailwindCSS User Site
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### 1. Backend Setup

```bash
cd backend
npm install
cp env.example .env
# Edit .env with your database and email credentials
npm run dev
```

**Default Admin Credentials:**
- Email: `agupta3@chirpn.com`
- Password: `Chirpn@123`

### 2. Admin Panel Setup

```bash
cd admin
npm install
npm run dev
```

Access at: http://localhost:5173

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Access at: http://localhost:3000

## 🔧 Configuration

### Backend Environment Variables

Create `.env` file in the `backend` directory:

```env
# Database Configuration
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DB=ayelearn_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Server Configuration
PORT=5000
NODE_ENV=development
```

## 📋 Features

### Backend (Node.js + Express + MySQL)
- ✅ JWT Authentication
- ✅ Password Reset with Email
- ✅ MySQL Database Integration
- ✅ Bcrypt Password Hashing
- ✅ Rate Limiting
- ✅ Security Headers
- ✅ Input Validation
- ✅ Error Handling

### Admin Panel (React + TailwindCSS)
- ✅ Modern Login Interface
- ✅ Forgot Password Flow
- ✅ Password Reset
- ✅ Protected Dashboard
- ✅ Responsive Design
- ✅ Sidebar Navigation
- ✅ User Management Ready

### Frontend (React + TailwindCSS)
- ✅ Landing Page
- ✅ Coming Soon Design
- ✅ Responsive Layout
- ✅ Modern UI Components
- ✅ Ready for Future Features

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Security headers with Helmet
- Token expiration (24h for login, 1h for reset)

## 📱 Responsive Design

All applications are fully responsive and work on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev  # Start with nodemon
```

### Admin Panel Development
```bash
cd admin
npm run dev  # Start Vite dev server
```

### Frontend Development
```bash
cd frontend
npm run dev  # Start Vite dev server
```

## 📦 Production Build

### Backend
```bash
cd backend
npm start
```

### Admin Panel
```bash
cd admin
npm run build
```

### Frontend
```bash
cd frontend
npm run build
```

## 🔗 API Endpoints

### Admin Routes
- `POST /api/admin/login` - Admin login
- `POST /api/admin/forgot-password` - Send reset email
- `POST /api/admin/reset-password/:token` - Reset password
- `GET /api/admin/dashboard` - Protected dashboard data

### Health Check
- `GET /health` - API health status

## 🎨 UI Components

### Admin Panel
- Glassmorphism login design
- Gradient buttons with hover effects
- Responsive sidebar navigation
- Dashboard with stats cards
- Form validation and error handling

### Frontend
- Modern landing page design
- Gradient backgrounds
- Feature showcase
- Call-to-action sections
- Professional footer

## 📝 Database Schema

### admin_users Table
```sql
CREATE TABLE admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  reset_token VARCHAR(255),
  reset_token_expiry DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code comments
- Create an issue in the repository

---

**Built with ❤️ using modern web technologies**
