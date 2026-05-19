# Realtime Coaching Feed Backend

A production-grade realtime backend built using Node.js, Express, Socket.IO, MongoDB, Redis, and Cloudinary.

This backend powers a realtime coaching feed dashboard where admins can post updates and all connected users instantly receive updates without refreshing the page.

---

# Features

- Realtime feed updates using Socket.IO
- REST APIs with Express
- MongoDB database integration
- Redis caching with Upstash
- Cloudinary image uploads
- Winston production logger
- Docker support
- Error handling middleware
- Scalable architecture
- Realtime event broadcasting
- Cache invalidation strategy
- Production-ready backend structure

---

# Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Socket.IO
- Upstash Redis
- Cloudinary
- Multer
- Winston
- Docker

---

# Project Structure

```bash
src/
│
├── config/
│   ├── cloudinary.js
│   ├── db.js
│   ├── logger.js
│   └── redis.js
│
├── controllers/
│   └── feedController.js
│
├── middleware/
│   └── uploadMiddleware.js
│
├── models/
│   └── feedModel.js
│
├── routes/
│   └── feedRoutes.js
│
├── uploads/
│
└── server.js
```

---

# Architecture

```bash
Frontend (Next.js + Socket.IO Client)
            ↓
Backend (Express + Socket.IO)
            ↓
MongoDB Atlas
            ↓
Upstash Redis
            ↓
Cloudinary
```

---

# Environment Variables

Create a `.env` file inside backend root:

```env
PORT=5000

MONGO_URI=

UPSTASH_REDIS_REST_URL=

UPSTASH_REDIS_REST_TOKEN=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

FRONTEND_URL=
```

---

# Installation

```bash
npm install
```

---

# Run Development Server

```bash
npm run dev
```

---

# Production Start

```bash
npm start
```

---

# API Routes

## GET /feed

Fetch all coaching feeds.

### Features
- Redis caching
- MongoDB fallback
- Latest feeds first

---

## POST /feed

Create a new coaching feed.

### Supports
- Title
- Description
- Author
- Image upload

### Content-Type

```bash
multipart/form-data
```

---

# Realtime Flow

```bash
Admin creates feed
        ↓
Backend saves to MongoDB
        ↓
Redis cache invalidated
        ↓
Socket.IO emits new-feed event
        ↓
Connected users receive update instantly
```

---

# Redis Caching Strategy

## GET /feed

```bash
Check Redis cache
      ↓
If cache exists → return cached data
      ↓
Else fetch MongoDB data
      ↓
Store in Redis
      ↓
Return response
```

---

# Cloudinary Upload Flow

```bash
Frontend uploads image
        ↓
Multer middleware processes file
        ↓
Cloudinary stores image
        ↓
Image URL saved in MongoDB
```

---

# Docker

## Build Docker Image

```bash
docker build -t coaching-feed-backend .
```

## Run Container

```bash
docker run -p 5000:5000 coaching-feed-backend
```

---

# Deployment

## Backend Deployment
- Render

## Database
- MongoDB Atlas

## Redis
- Upstash Redis

## Image Hosting
- Cloudinary

---

# Logging

Winston logger is used for:
- API logs
- Error logs
- Socket connection logs
- Startup logs

Logs are stored in:

```bash
logs/
```

---

# Production Features

- Centralized error handling
- Environment-based configuration
- Realtime socket handling
- Duplicate socket prevention
- Responsive API architecture
- Production logging
- Cloud image hosting
- Redis optimization

---

# Future Improvements

- Authentication
- Role-based access
- Pagination
- Feed reactions
- Notifications
- Analytics dashboard

---

# Author

Samanvith
