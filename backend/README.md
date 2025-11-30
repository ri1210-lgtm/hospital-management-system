# Hospital Management System - Backend

This is the backend API for the Hospital Management System built with Node.js, Express, and MongoDB.

## Features

- Multi-tenant architecture with data isolation
- Role-based access control (Admin, Doctor, Receptionist)
- JWT authentication
- RESTful API design
- Data validation and error handling

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or cloud instance)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

5. Update the `.env` file with your configuration:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/hms
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRATION=7d
   ```

### Running the Application

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured port).

## API Documentation

Refer to [DOCUMENTATION.md](DOCUMENTATION.md) for detailed API documentation, including:
- Data models
- API endpoints
- Request/response examples
- Authentication and authorization
- Testing with Postman

## Project Structure

```
backend/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── utils/           # Utility functions
├── server.js        # Entry point
└── package.json     # Dependencies and scripts
```

## Authentication

The API uses JWT tokens for authentication. After logging in, include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Role-Based Access Control

- **Admin**: Full access to all features
- **Doctor**: Can manage prescriptions and view patients
- **Receptionist**: Can register patients and manage appointments

## Data Isolation

Each hospital operates in its own isolated environment using tenant IDs, ensuring data privacy and separation.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License.

## Contact

For support or queries, please contact the development team.