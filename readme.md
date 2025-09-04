# Hospital Billing System - Backend

This is the backend service for the Hospital Billing System, built with Node.js, Express, and Sequelize (MySQL). It provides RESTful APIs for authentication, billing, patient management, references, and test management.

## Features

- User authentication (JWT-based)
- Role-based access control (admin, reception)
- Bill creation and management
- Patient and test management
- Reference (doctor/PC) management
- Modular MVC structure

## Project Structure

```
backend/
├── index.js                # Entry point
├── package.json
├── config/                 # Database configuration
│   ├── db.js
│   └── sequelize.js
├── controllers/            # Route controllers
│   ├── authController.js
│   ├── billController.js
│   ├── receptionController.js
│   ├── referenceController.js
│   └── testController.js
├── middlewares/            # Auth and role middlewares
│   ├── authMiddleware.js
│   └── roleMiddleware.js
├── models/                 # Sequelize models
│   ├── bill.js
│   ├── login.js
│   ├── reference.js
│   ├── test.js
│   └── user.js
└── routes/                 # API route definitions
    ├── authRoutes.js
    ├── billRoutes.js
    ├── patientRoutes.js
    ├── receptionRoutes.js
    ├── referenceRoutes.js
    └── testRoutes.js
```

## Setup Instructions

1. **Clone the repository**

   ```
   git clone <repository-url>
   cd hospital-billing-system/backend
   ```

2. **Install dependencies**

   ```
   npm install
   ```

3. **Configure the database**

   - Edit `config/db.js` and `config/sequelize.js` with your MySQL credentials.

4. **Run database migrations (if any)**

   - Ensure your database is created and accessible.

5. **Start the server**

   ```
   npm start
   ```
   The server will run on the port specified in your environment or default (e.g., 3000).

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user (admin only)

### Billing

- `POST /api/bills` - Create a new bill
- `GET /api/bills` - List all bills
- `GET /api/bills/:id` - Get bill by ID

### Patients

- `GET /api/patients` - List patients
- `GET /api/patients/:id` - Get patient details

### References

- `GET /api/references` - List all references (doctors/PCs)
- `POST /api/references` - Add a new reference

### Tests

- `GET /api/tests` - List all tests
- `POST /api/tests` - Add a new test

## Environment Variables

Create a `.env` file in the backend directory with the following (example):

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=hospital_billing
JWT_SECRET=your_jwt_secret
PORT=3000
```

## Model Overview

- **User:** email, password, username, role
- **Bill:** patient info, doctor, tests, amounts, discounts, etc.
- **Reference:** name, code, type (doctor/PC)
- **Test:** code, description, rate

## License

This project is for educational and internal use. Please check with the repository owner for licensing