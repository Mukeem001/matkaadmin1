# Matka User API Documentation

## Overview
Complete user-side APIs for the Matka Admin Panel system. These APIs allow users to interact with the matka gaming system including authentication, bidding, wallet management, and more.

## Base URL
```
/api
```

## Authentication
All user endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Authentication

#### User Login
```http
POST /auth/user/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "1234567890",
    "walletBalance": 1000.00,
    "isBlocked": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### User Signup
```http
POST /auth/signup
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "phone": "1234567890",
  "password": "password123"
}
```

#### Get User Profile
```http
GET /auth/user/me
```

### User Profile

#### Get Profile
```http
GET /user/profile
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "user@example.com",
  "phone": "1234567890",
  "walletBalance": 1000.00,
  "isBlocked": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Update Profile
```http
PUT /user/profile
```

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "0987654321"
}
```

### Markets

#### Get Active Markets
```http
GET /user/markets
```

**Response:**
```json
{
  "markets": [
    {
      "id": 1,
      "name": "Main Market",
      "openTime": "10:00",
      "closeTime": "18:00",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Bidding

#### Place a Bid
```http
POST /user/bids
```

**Request Body:**
```json
{
  "marketId": 1,
  "gameType": "single_digit",
  "amount": 100.00,
  "number": "5"
}
```

**Game Types:**
- `single_digit`: 1 digit (0-9)
- `jodi`: 2 digits (00-99)
- `single_panna`: 3 digits
- `double_panna`: 3 digits (two same)
- `triple_panna`: 3 digits (all different)
- `half_sangam`: 3 digits
- `full_sangam`: 6 digits (open+close)

#### Get Bid History
```http
GET /user/bids?page=1&limit=20
```

**Response:**
```json
{
  "bids": [
    {
      "id": 1,
      "marketId": 1,
      "marketName": "Main Market",
      "gameType": "single_digit",
      "amount": 100.00,
      "number": "5",
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

### Wallet Management

#### Create Deposit Request
```http
POST /user/deposits
```

**Request Body:**
```json
{
  "amount": 500.00,
  "paymentMethod": "upi",
  "transactionId": "TXN123456",
  "screenshotUrl": "https://example.com/screenshot.jpg"
}
```

#### Get Deposit History
```http
GET /user/deposits?page=1&limit=20
```

#### Create Withdrawal Request
```http
POST /user/withdrawals
```

**Request Body:**
```json
{
  "amount": 200.00,
  "bankName": "Bank Name",
  "accountNumber": "1234567890",
  "ifscCode": "IFSC0001",
  "upiId": "user@upi"
}
```

#### Get Withdrawal History
```http
GET /user/withdrawals?page=1&limit=20
```

### Results

#### Get Market Results
```http
GET /user/results?page=1&limit=20
```

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "marketId": 1,
      "marketName": "Main Market",
      "resultDate": "2024-01-01",
      "openResult": "123",
      "closeResult": "456",
      "jodiResult": "79",
      "pannaResult": "123",
      "declaredAt": "2024-01-01T18:00:00.000Z",
      "createdAt": "2024-01-01T18:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

### Dashboard & Statistics

#### Get Dashboard Stats
```http
GET /user/dashboard
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "1234567890",
    "walletBalance": 1000.00,
    "isBlocked": false
  },
  "stats": {
    "totalBids": 10,
    "totalBidAmount": 1000.00,
    "wonBids": 3,
    "lostBids": 6,
    "pendingBids": 1,
    "totalWinnings": 270.00
  }
}
```

#### Get Win History
```http
GET /user/wins?page=1&limit=20
```

#### Get Daily Leaderboard
```http
GET /user/leaderboard?limit=10
```

**Response:**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "userId": 1,
      "userName": "John Doe",
      "totalWinnings": 1000.00,
      "winCount": 5
    }
  ]
}
```

### Notices/Announcements

#### Get Active Notices
```http
GET /user/notices
```

**Response:**
```json
{
  "notices": [
    {
      "id": 1,
      "title": "New Market Added",
      "content": "We have added a new market for your bidding pleasure!",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Security Features

### ✅ Implemented
- JWT authentication for all user routes
- Request validation using Zod schemas
- Prevention of negative wallet balances
- Duplicate bid prevention
- User blocking checks
- Market timing validation (bidding closes at market close time)
- Bid amount limits (1-10000)
- Input sanitization and validation

### ❌ User Cannot Do
- Access admin APIs (protected by different middleware)
- Modify market results
- Change wallet balance manually
- Approve deposits/withdrawals
- View other users' bids
- Place bids on inactive markets
- Place bids after market close time
- Withdraw more than wallet balance
- Place bids if account is blocked

## Game Rules & Winning Logic

### Single Digit
- Bid on last digit of (open + close) sum
- Example: Open=123, Close=456, Sum=579, Winner digit=9

### Jodi
- Bid on exact sum of (open + close)
- Example: Open=123, Close=456, Sum=579, Winner=79

### Panna Types
- **Single Panna**: Exact 3-digit match
- **Double Panna**: 3 digits with exactly 2 same
- **Triple Panna**: 3 digits all different

### Sangam
- **Half Sangam**: Match either open or close result
- **Full Sangam**: Match both open and close results (6 digits)

## Error Responses

All endpoints return standardized error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (blocked user)
- `404`: Not Found
- `409`: Conflict (duplicate bid)
- `500`: Internal Server Error

## Rate Limiting & Pagination

- All list endpoints support pagination with `page` and `limit` query parameters
- Default limit: 20 items per page
- Maximum limit: 100 items per page

## Data Types

- All monetary values are in decimal format (e.g., 100.00)
- Dates are in ISO 8601 format
- IDs are integers
- Phone numbers are strings (allow international formats)

## Production Considerations

- All database operations use transactions for data integrity
- Bid processing is atomic and safe
- Wallet balance updates are protected against race conditions
- Comprehensive logging for debugging and monitoring
- Input validation prevents SQL injection and XSS attacks