# Hospital Management System - Backend Documentation

## Table of Contents
1. [Project Structure](#project-structure)
2. [Data Models](#data-models)
3. [API Routes](#api-routes)
4. [Authentication & Authorization](#authentication--authorization)
5. [Testing with Postman](#testing-with-postman)
6. [Environment Variables](#environment-variables)

## Project Structure

```
backend/
├── config/
│   ├── db.js
│   └── jwt.js
├── controllers/
│   ├── auth.controller.js
│   ├── hospital.controller.js
│   ├── user.controller.js
│   ├── patient.controller.js
│   └── prescription.controller.js
├── middleware/
│   └── auth.middleware.js
├── models/
│   ├── Hospital.js
│   ├── User.js
│   ├── Patient.js
│   └── Prescription.js
├── routes/
│   ├── auth.routes.js
│   ├── hospital.routes.js
│   ├── user.routes.js
│   ├── patient.routes.js
│   └── prescription.routes.js
├── utils/
│   └── jwt.utils.js
├── .env
├── server.js
└── package.json
```

## Data Models

### Hospital Model
Represents a hospital entity in the system.

**Fields:**
- `name` (String, required): Name of the hospital
- `email` (String, required, unique): Contact email for the hospital
- `phone` (String, required): Contact phone number
- `address` (Object, required): Physical address containing street, city, state, zipCode, country
- `tenantId` (String, required, unique): Unique identifier for data isolation
- `isActive` (Boolean, default: true): Status of the hospital account
- `timestamps` (Date): Created and updated timestamps

### User Model
Represents staff members (admin, doctors, receptionists).

**Fields:**
- `name` (String, required): Full name of the user
- `email` (String, required, unique): Email address for login
- `password` (String, required): Hashed password
- `role` (String, enum: ['admin', 'doctor', 'receptionist'], required): User role
- `hospital` (ObjectId, ref: Hospital, required): Reference to the hospital
- `tenantId` (String, required): Tenant identifier for data isolation
- `isActive` (Boolean, default: true): Account status
- `timestamps` (Date): Created and updated timestamps

### Patient Model
Represents patient records.

**Fields:**
- `name` (String, required): Full name of the patient
- `dateOfBirth` (Date, required): Patient's date of birth
- `gender` (String, enum: ['male', 'female', 'other'], required): Gender
- `phone` (String, required): Contact phone number
- `email` (String): Optional email address
- `address` (Object): Physical address
- `emergencyContact` (Object): Emergency contact information
- `bloodType` (String, enum): Blood group
- `allergies` (Array): List of known allergies
- `medicalHistory` (Array): Medical history records
- `hospital` (ObjectId, ref: Hospital, required): Reference to the hospital
- `tenantId` (String, required): Tenant identifier for data isolation
- `createdBy` (ObjectId, ref: User, required): Staff who registered the patient
- `timestamps` (Date): Created and updated timestamps

### Prescription Model
Represents medical prescriptions written by doctors.

**Fields:**
- `patient` (ObjectId, ref: Patient, required): Reference to the patient
- `doctor` (ObjectId, ref: User, required): Reference to the prescribing doctor
- `hospital` (ObjectId, ref: Hospital, required): Reference to the hospital
- `tenantId` (String, required): Tenant identifier for data isolation
- `diagnosis` (String, required): Medical diagnosis
- `medications` (Array, required): List of prescribed medications with details
- `tests` (Array): Recommended medical tests
- `followUpDate` (Date): Scheduled follow-up appointment
- `notes` (String): Additional notes from the doctor
- `isActive` (Boolean, default: true): Prescription status
- `timestamps` (Date): Created and updated timestamps

## API Routes

### Authentication Routes
Base URL: `/api/auth`

#### POST `/register`
Register a new hospital and create an admin user.

**Request Body:**
```json
{
  "name": "City Hospital",
  "email": "contact@cityhospital.com",
  "phone": "+1234567890",
  "address": {
    "street": "123 Medical Street",
    "city": "Health City",
    "state": "Wellness State",
    "zipCode": "12345",
    "country": "Country"
  },
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "Hospital registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f7b2b9d9e1a40015d2d9a1",
    "name": "City Hospital Admin",
    "email": "admin@cityhospital.com",
    "role": "admin",
    "tenantId": "tenant_1626821817_1234"
  },
  "hospital": {
    "id": "60f7b2b9d9e1a40015d2d9a2",
    "name": "City Hospital",
    "tenantId": "tenant_1626821817_1234"
  }
}
```

#### POST `/login`
Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "admin@cityhospital.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f7b2b9d9e1a40015d2d9a1",
    "name": "City Hospital Admin",
    "email": "admin@cityhospital.com",
    "role": "admin",
    "tenantId": "tenant_1626821817_1234"
  },
  "hospital": {
    "id": "60f7b2b9d9e1a40015d2d9a2",
    "name": "City Hospital",
    "tenantId": "tenant_1626821817_1234"
  }
}
```

### Hospital Routes
Base URL: `/api/hospitals`
Requires authentication and admin authorization.

#### GET `/:id`
Get hospital details by ID.

#### PUT `/:id`
Update hospital information.

**Request Body:**
```json
{
  "name": "Updated Hospital Name",
  "email": "updated@hospital.com",
  "phone": "+1987654321",
  "address": {
    "street": "456 Healthcare Ave",
    "city": "Medical City",
    "state": "Health State",
    "zipCode": "54321",
    "country": "Country"
  }
}
```

#### DELETE `/:id`
Deactivate a hospital.

### User Routes
Base URL: `/api/users`
Requires authentication.

#### POST `/`
Create a new staff member (admin only).

**Request Body:**
```json
{
  "name": "Dr. John Smith",
  "email": "john@cityhospital.com",
  "password": "doctorPassword123",
  "role": "doctor"
}
```

#### GET `/`
Get all staff members in the hospital.

#### GET `/:id`
Get a specific staff member by ID.

#### PUT `/:id`
Update staff member information.

**Request Body:**
```json
{
  "name": "Dr. John A. Smith",
  "email": "johnsmith@cityhospital.com"
}
```

#### DELETE `/:id`
Deactivate a staff member (admin only).

### Patient Routes
Base URL: `/api/patients`
Requires authentication.

#### POST `/`
Register a new patient (receptionist and admin only).

**Request Body:**
```json
{
  "name": "Jane Doe",
  "dateOfBirth": "1990-05-15",
  "gender": "female",
  "phone": "+1555123456",
  "email": "jane@example.com",
  "address": {
    "street": "789 Patient Lane",
    "city": "Wellness City",
    "state": "Healthy State",
    "zipCode": "67890",
    "country": "Country"
  },
  "emergencyContact": {
    "name": "John Doe",
    "relationship": "Spouse",
    "phone": "+1555987654"
  },
  "bloodType": "O+",
  "allergies": ["Penicillin", "Pollen"],
  "medicalHistory": [
    {
      "condition": "Hypertension",
      "diagnosisDate": "2020-01-15",
      "notes": "Managed with medication"
    }
  ]
}
```

#### GET `/`
Get all patients in the hospital.

#### GET `/search?query=patient_name_or_phone`
Search for patients by name or phone number.

#### GET `/:id`
Get a specific patient by ID.

#### PUT `/:id`
Update patient information.

### Prescription Routes
Base URL: `/api/prescriptions`
Requires authentication.

#### POST `/`
Create a new prescription (doctor only).

**Request Body:**
```json
{
  "patientId": "60f7b2b9d9e1a40015d2d9c1",
  "diagnosis": "Acute bronchitis",
  "medications": [
    {
      "name": "Amoxicillin",
      "dosage": "500mg",
      "frequency": "Three times daily",
      "duration": "7 days",
      "instructions": "Take with food"
    }
  ],
  "tests": [
    {
      "name": "Chest X-ray",
      "instructions": "Schedule within next 3 days"
    }
  ],
  "followUpDate": "2023-08-15",
  "notes": "Patient advised to rest and drink plenty of fluids"
}
```

#### GET `/`
Get all prescriptions in the hospital.

#### GET `/patient/:patientId`
Get all prescriptions for a specific patient.

#### GET `/:id`
Get a specific prescription by ID.

#### PUT `/:id`
Update a prescription (doctor only).

#### DELETE `/:id`
Deactivate a prescription (doctor only).

## Authentication & Authorization

The system uses JWT (JSON Web Tokens) for authentication and role-based access control for authorization.

### Roles
1. **Admin**: Full access to all features
2. **Doctor**: Can create/view prescriptions, view patients
3. **Receptionist**: Can register patients, view patient list

### Protected Routes
All routes except authentication routes require a valid JWT token in the Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Role-based Access
Certain routes have additional role requirements:
- Creating staff members: Admin only
- Deactivating staff members: Admin only
- Registering patients: Receptionist and Admin
- Creating prescriptions: Doctor only
- Updating prescriptions: Doctor only
- Deactivating prescriptions: Doctor only

## Testing with Postman

### Setting Up Environment Variables
1. Create a new environment in Postman
2. Add the following variables:
   - `baseUrl`: http://localhost:5000/api
   - `token`: (leave empty initially, will be populated after login)

### Collection Setup
1. Create a new collection named "HMS API"
2. Add the following requests:

#### Authentication Folder
- **Register Hospital**
  - Method: POST
  - URL: {{baseUrl}}/auth/register
  - Body: Raw JSON (example above)
  
- **Login**
  - Method: POST
  - URL: {{baseUrl}}/auth/login
  - Body: Raw JSON (example above)
  - Tests Script:
    ```javascript
    pm.test("Status code is 200", function () {
        pm.response.to.have.status(200);
    });
    
    const jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
    ```

#### Hospital Management Folder
- **Get Hospital Details**
  - Method: GET
  - URL: {{baseUrl}}/hospitals/{{hospitalId}}
  - Headers:
    - Authorization: Bearer {{token}}

- **Update Hospital**
  - Method: PUT
  - URL: {{baseUrl}}/hospitals/{{hospitalId}}
  - Headers:
    - Authorization: Bearer {{token}}
  - Body: Raw JSON

- **Deactivate Hospital**
  - Method: DELETE
  - URL: {{baseUrl}}/hospitals/{{hospitalId}}
  - Headers:
    - Authorization: Bearer {{token}}

#### User Management Folder
- **Create Staff Member**
  - Method: POST
  - URL: {{baseUrl}}/users
  - Headers:
    - Authorization: Bearer {{token}}
  - Body: Raw JSON

- **Get All Staff**
  - Method: GET
  - URL: {{baseUrl}}/users
  - Headers:
    - Authorization: Bearer {{token}}

- **Get Staff Member**
  - Method: GET
  - URL: {{baseUrl}}/users/{{userId}}
  - Headers:
    - Authorization: Bearer {{token}}

- **Update Staff Member**
  - Method: PUT
  - URL: {{baseUrl}}/users/{{userId}}
  - Headers:
    - Authorization: Bearer {{token}}
  - Body: Raw JSON

- **Deactivate Staff Member**
  - Method: DELETE
  - URL: {{baseUrl}}/users/{{userId}}
  - Headers:
    - Authorization: Bearer {{token}}

#### Patient Management Folder
- **Register Patient**
  - Method: POST
  - URL: {{baseUrl}}/patients
  - Headers:
    - Authorization: Bearer {{token}}
  - Body: Raw JSON

- **Get All Patients**
  - Method: GET
  - URL: {{baseUrl}}/patients
  - Headers:
    - Authorization: Bearer {{token}}

- **Search Patients**
  - Method: GET
  - URL: {{baseUrl}}/patients/search?query=jane
  - Headers:
    - Authorization: Bearer {{token}}

- **Get Patient**
  - Method: GET
  - URL: {{baseUrl}}/patients/{{patientId}}
  - Headers:
    - Authorization: Bearer {{token}}

- **Update Patient**
  - Method: PUT
  - URL: {{baseUrl}}/patients/{{patientId}}
  - Headers:
    - Authorization: Bearer {{token}}
  - Body: Raw JSON

#### Prescription Management Folder
- **Create Prescription**
  - Method: POST
  - URL: {{baseUrl}}/prescriptions
  - Headers:
    - Authorization: Bearer {{token}}
  - Body: Raw JSON

- **Get All Prescriptions**
  - Method: GET
  - URL: {{baseUrl}}/prescriptions
  - Headers:
    - Authorization: Bearer {{token}}

- **Get Patient Prescriptions**
  - Method: GET
  - URL: {{baseUrl}}/prescriptions/patient/{{patientId}}
  - Headers:
    - Authorization: Bearer {{token}}

- **Get Prescription**
  - Method: GET
  - URL: {{baseUrl}}/prescriptions/{{prescriptionId}}
  - Headers:
    - Authorization: Bearer {{token}}

- **Update Prescription**
  - Method: PUT
  - URL: {{baseUrl}}/prescriptions/{{prescriptionId}}
  - Headers:
    - Authorization: Bearer {{token}}
  - Body: Raw JSON

- **Deactivate Prescription**
  - Method: DELETE
  - URL: {{baseUrl}}/prescriptions/{{prescriptionId}}
  - Headers:
    - Authorization: Bearer {{token}}

### Testing Workflow
1. Start with the Register Hospital request
2. Use the Login request to get a JWT token
3. Test other endpoints using the token
4. For role-specific testing, create users with different roles and log in as each one

## Environment Variables

Create a `.env` file in the backend root directory with the following variables:

```
# Server Configuration
PORT=5000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/hms

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRATION=7d
```

### Variable Descriptions
- `PORT`: The port on which the server will run (default: 5000)
- `MONGODB_URI`: Connection string for MongoDB database
- `JWT_SECRET`: Secret key for signing JWT tokens (should be a strong, random string)
- `JWT_EXPIRATION`: Token expiration time (e.g., '7d' for 7 days, '24h' for 24 hours)

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## Data Isolation

Each hospital operates in its own isolated environment using the `tenantId` field. All data operations are scoped to the tenantId of the authenticated user, ensuring that hospitals cannot access each other's data.