# ayeLearn Backend API

Node.js + Express + MySQL backend API for the ayeLearn learning platform.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```

3. **Configure your `.env` file:**
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

4. **Create MySQL database:**
   ```sql
   CREATE DATABASE ayelearn_db;
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## 📋 API Endpoints

### Health Check
- `GET /health` - API health status

### Admin Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/forgot-password` - Send password reset email
- `POST /api/admin/reset-password/:token` - Reset password with token
- `GET /api/admin/dashboard` - Protected dashboard data

## 🔐 Authentication

### Login Request
```json
{
  "email": "agupta3@chirpn.com",
  "password": "Chirpn@123"
}
```

### Login Response
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "admin": {
    "id": 1,
    "email": "agupta3@chirpn.com"
  }
}
```

### Protected Routes
Include the JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## 🗄️ Database Schema

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

## 🔧 Configuration

### Email Setup (Gmail)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password in your `.env` file

### JWT Secret
Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🛡️ Security Features

- **JWT Authentication** - Token-based authentication
- **Password Hashing** - Bcrypt with salt rounds
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **Input Validation** - Express-validator middleware
- **CORS Protection** - Configured for specific origins
- **Security Headers** - Helmet.js protection
- **Token Expiration** - 24h for login, 1h for reset tokens

## 📝 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

## 🧪 Development

### Start with nodemon (auto-restart):
```bash
npm run dev
```

### Start production server:
```bash
npm start
```

### Check API health:
```bash
curl http://localhost:5000/health
```

## 📦 Dependencies

### Core Dependencies
- `express` - Web framework
- `mysql2` - MySQL client
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `nodemailer` - Email sending
- `cors` - Cross-origin resource sharing
- `helmet` - Security headers
- `express-rate-limit` - Rate limiting
- `express-validator` - Input validation

### Development Dependencies
- `nodemon` - Auto-restart on file changes
- `dotenv` - Environment variable management

## 🔍 Logging

The API includes request logging that shows:
- Timestamp
- HTTP method
- Request path

## 🚨 Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials)
- `403` - Forbidden (invalid token)
- `404` - Not Found
- `500` - Internal Server Error

## 📞 Support

For issues and questions:
1. Check the logs for error details
2. Verify your environment variables
3. Ensure MySQL is running and accessible
4. Check email configuration for password reset functionality
