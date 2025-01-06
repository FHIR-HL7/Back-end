# EHR Project

## Overview

This project is a comprehensive Electronic Health Record (EHR) system built using Node.js, Express, and MongoDB. It provides a robust API for managing various healthcare-related entities such as patients, practitioners, medications, organizations, and more. The system is designed to be scalable, secure, and easy to maintain.

## Table of Contents

- Overview
- Architecture
- API Endpoints
- Installation
- Usage
- Technologies Used
- Contributing
- License

## Architecture

The project follows an enhanced Model-View-Controller (MVC) architecture, with each module responsible for a specific part of the system. This structure ensures a clean separation of concerns, making the codebase more maintainable and scalable. The main components are:

- **Controllers**: Handle the business logic and interact with the database.
- **Routers**: Define the API endpoints and map them to the appropriate controller functions.
- **Models**: Define the data structures and interact with the MongoDB database.
- **Helpers**: Provide utility functions used across the application.
- **Middlewares**: Handle authentication and other request processing tasks.
- **Validation Schemas**: Define the validation rules for incoming requests using Joi.

### Directory Structure

```
├── .gitignore
├── app.ts
├── package.json
├── public/
│   ├── docs/
│   └── images/
├── src/
│   ├── controllers/
│   ├── db/
│   ├── enums/
│   ├── helpers/
│   ├── interfaces/
│   ├── middlewares/
│   ├── models/
│   ├── requests/
│   ├── routers/
│   ├── statics/
│   ├── types/
│   └── validationSchemas.ts
├── test.json
└── tsconfig.json
```

## API Endpoints

The API provides endpoints for managing various entities. Below is a summary of the available endpoints. For detailed documentation, please refer to the [Postman API Documentation](https://documenter.getpostman.com/view/33753803/2sAYJ9AeAs).

### Users
- `POST /api/users/register`: Register a new user
- `POST /api/users/login`: Login a user
- `GET /api/users/profile`: Get user profile
- `PATCH /api/users/profile`: Update user profile

### Patients
- `POST /api/patients`: Create a new patient
- `GET /api/patients`: Get all patients
- `GET /api/patients/:id`: Get a patient by ID
- `DELETE /api/patients/:id`: Delete a patient by ID
- `PATCH /api/patients/:id`: Update a patient by ID

### Practitioners
- `POST /api/practitioners`: Create a new practitioner
- `GET /api/practitioners`: Get all practitioners
- `GET /api/practitioners/:id`: Get a practitioner by ID
- `DELETE /api/practitioners/:id`: Delete a practitioner by ID
- `PATCH /api/practitioners/:id`: Update a practitioner by ID

### Medications
- `POST /api/medications`: Create a new medication
- `GET /api/medications`: Get all medications
- `GET /api/medications/:id`: Get a medication by ID
- `DELETE /api/medications/:id`: Delete a medication by ID
- `PATCH /api/medications/:id`: Update a medication by ID

### Organizations
- `POST /api/organizations`: Create a new organization
- `GET /api/organizations`: Get all organizations
- `GET /api/organizations/:id`: Get an organization by ID
- `DELETE /api/organizations/:id`: Delete an organization by ID
- `PATCH /api/organizations/:id`: Update an organization by ID

### Encounters
- `POST /api/encounters`: Create a new encounter
- `GET /api/encounters`: Get all encounters
- `GET /api/encounters/:id`: Get an encounter by ID
- `DELETE /api/encounters/:id`: Delete an encounter by ID
- `PATCH /api/encounters/:id`: Update an encounter by ID

### Payments
- `POST /api/payments`: Create a new payment
- `GET /api/payments`: Get all payments
- `GET /api/payments/:id`: Get a payment by ID
- `DELETE /api/payments/:id`: Delete a payment by ID
- `PATCH /api/payments/:id`: Update a payment by ID

### Lab Tests
- `POST /api/labTests`: Create a new lab test
- `GET /api/labTests`: Get all lab tests
- `GET /api/labTests/:id`: Get a lab test by ID
- `DELETE /api/labTests/:id`: Delete a lab test by ID
- `PATCH /api/labTests/:id`: Update a lab test by ID

### Medication Prescriptions
- `POST /api/medicationPrescriptions`: Create a new medication prescription
- `GET /api/medicationPrescriptions`: Get all medication prescriptions
- `GET /api/medicationPrescriptions/:id`: Get a medication prescription by ID
- `DELETE /api/medicationPrescriptions/:id`: Delete a medication prescription by ID
- `PATCH /api/medicationPrescriptions/:id`: Update a medication prescription by ID

### Observations
- `POST /api/observations`: Create a new observation
- `GET /api/observations`: Get all observations
- `GET /api/observations/:id`: Get an observation by ID
- `DELETE /api/observations/:id`: Delete an observation by ID
- `PATCH /api/observations/:id`: Update an observation by ID

### Diagnostic Reports
- `POST /api/diagnosticReports`: Create a new diagnostic report
- `GET /api/diagnosticReports`: Get all diagnostic reports
- `GET /api/diagnosticReports/:id`: Get a diagnostic report by ID
- `DELETE /api/diagnosticReports/:id`: Delete a diagnostic report by ID
- `PATCH /api/diagnosticReports/:id`: Update a diagnostic report by ID

### Attachments
- `POST /api/attachments`: Create a new attachment
- `GET /api/attachments`: Get all attachments
- `GET /api/attachments/:id`: Get an attachment by ID
- `DELETE /api/attachments/:id`: Delete an attachment by ID
- `PATCH /api/attachments/:id`: Update an attachment by ID

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/linked-in.git
    cd linked-in
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Set up the environment variables:
    ```sh
    cp .env.example .env
    ```

4. Start the MongoDB server:
    ```sh
    mongod
    ```

5. Start the application:
    ```sh
    npm start
    ```

## Usage

To use the API, you can use tools like Postman or cURL to make requests to the endpoints. For detailed API documentation, refer to the [Postman API Documentation](https://documenter.getpostman.com/view/33753803/2sAYJ9AeAs).

## Technologies Used

- **Node.js**: JavaScript runtime for building server-side applications.
- **Express**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing application data.
- **TypeScript**: Superset of JavaScript that adds static typing.
- **JWT**: JSON Web Tokens for authentication and authorization.
- **Joi**: Validation library for request data.
- **Nodemon**: Tool for automatically restarting the server during development.


## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License.

## My Impact

In this project, I have contributed significantly to the development of the backend API. My contributions include:

- Designing and implementing the architecture of the project.
- Developing the controllers, routers, and models for various entities.
- Implementing authentication and authorization using JWT.
- Writing validation schemas using Joi to ensure data integrity.
- Creating utility functions and middlewares to streamline the development process.
- Writing comprehensive documentation for the API endpoints.

Feel free to reach out if you have any questions or need further assistance!

---
