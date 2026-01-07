# API Documentation

## 1. Getting Started

### Installation

1. Download the zip file from GitHub.
2. Unzip the file and navigate to the directory.
3. Install dependencies:

```bash
npm install
```

### Setup & Running

1. Start Development Server:

```bash
npm run dev
```

2. Watch file changes:

```bash
npm run watch
```

## 2. API Reference

### Base URL: `localhost:5500/api`

### Authentication Endpoints

1. Register User

**_Signs up a new user._**

- Endpoint: `/auth`

- Method: `POST`

**Request Body:**

```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "695dc8b7844da31fee27ea80",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "tokenVersion": 0,
    "emailVerified": false
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

2. Login User

**_Logs in an existing user._**

- Endpoint: `/auth/login`

- Method: `POST`

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User logged in successfully",
  "user": {
    "_id": "695dc8b7844da31fee27ea80",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "tokenVersion": 0,
    "emailVerified": false
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

3. Refresh Token

**_Swaps out the access and refresh tokens. Returns a new accessToken._**

- Endpoint: `/auth/refresh`

- Method: `POST`

**Request Body:**

```json
{}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
