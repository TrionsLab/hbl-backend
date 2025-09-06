# Hospital Billing System - Backend

Backend service for Hospital Billing System, built with Node.js, Express, and Sequelize (MySQL). It provides RESTful APIs for authentication, billing, patient management, doctor/primary care management, and test management.

## Features

- User authentication (JWT-based)
- Role-based access control (super_admin, admin, reception)
- Bill creation and management
- Patient, doctor, primary care, and test management
- Modular MVC structure

## Project Structure

```
.
├── index.js                  # Entry point
├── package.json
├── config/
│   ├── config.js             # App/server config
│   ├── db.js                 # MySQL connection (raw)
│   └── sequelize.js          # Sequelize instance
├── controllers/
│   ├── authController.js
│   ├── billController.js
│   ├── doctorController.js
│   ├── patientController.js
│   ├── primaryCareController.js
│   ├── receptionController.js
│   └── testController.js
├── middlewares/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
├── models/
│   ├── Bill_v2.js
│   ├── Doctor.js
│   ├── Patient.js
│   ├── PrimaryCare.js
│   ├── Referral.js
│   ├── Test.js
│   └── User_v2.js
├── routes/
│   ├── authRoutes.js
│   ├── billRoutes.js
│   ├── doctorRoutes.js
│   ├── patientRoutes.js
│   ├── primaryCareRoutes.js
│   ├── receptionRoutes.js
│   └── testRoutes.js
├── utils/
│   └── helpers/
│       ├── dateHelper.js
│       └── responseHelper.js
├── .env.example
├── migrations.json
├── db_script.txt
└── readme.md
```

## Setup Instructions

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd hbl-backend
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Configure the database**
   - Edit `.env` or `.env.example` with your MySQL credentials.

4. **Run database migrations**
   - Use `db_script.txt` or `migrations.json` to set up tables.

5. **Start the server**
   ```
   npm start
   ```
   The server runs on the port specified in `.env` (default: 3000).

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user (admin only)
- `POST /api/auth/logout` - Logout

### Billing
- `POST /api/bills` - Create a new bill
- `GET /api/bills` - List all bills
- `GET /api/bills/archived` - List archived bills
- `GET /api/bills/stats` - Monthly stats
- `GET /api/bills/referral-earnings` - Referral earnings
- `PUT /api/bills/:id/archive` - Archive bill
- `PUT /api/bills/:id/restore` - Restore bill
- `PUT /api/bills/:id/clear-due` - Clear bill due
- `DELETE /api/bills/:id` - Delete bill

### Patients
- `POST /api/patient` - Add patient
- `GET /api/patient` - List patients

### Doctors
- `POST /api/doctors` - Add doctor
- `GET /api/doctors` - List doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor

### Primary Care
- `POST /api/primary-care` - Add primary care
- `GET /api/primary-care` - List all
- `GET /api/primary-care/:id` - Get by ID
- `PUT /api/primary-care/:id` - Update
- `DELETE /api/primary-care/:id` - Delete (soft)

### Reception
- `POST /api/receptions` - Add reception
- `GET /api/receptions` - List receptions
- `PUT /api/receptions/:id` - Update reception
- `DELETE /api/receptions/:id` - Delete reception

### Tests
- `POST /api/tests` - Add test
- `GET /api/tests` - List tests
- `PUT /api/tests/:id` - Update test
- `DELETE /api/tests/:id` - Delete test

## Environment Variables

Create a `.env` file in the backend directory:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=clinic
DB_PORT=3306
PORT=3000
JWT_SECRET=your_jwt_secret
```

## Model Overview

- **User_v2:** username, email, password, role (super_admin, admin, reception)
- **Bill_v2:** idNo, date, time, billType, grossAmount, discount, extraDiscount, due, totalAmount, receivedAmount, archive, archivedAt, deletedAt, patientId, receptionistId, visitedDoctorId, doctorReferralId, pcReferralId
- **Doctor:** name, specialization, fee
- **Patient:** name, age, ageMonths, gender, phone
- **PrimaryCare:** name, address, fee, deletedAt
- **Referral:** name, type (doctor/pc), code, fee
- **Test:** code, description, rate

## License

This project is for educational and internal use. Please check with the repository owner for