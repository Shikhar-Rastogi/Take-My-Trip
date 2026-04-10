# 🌍 Take My Trip – Travel Planner Web Application

**Take My Trip** is a travel planning platform where users can discover destinations, book tours, and manage trips in one place.

---

## 🚀 Features

- 🌐 Explore destination tours with details and reviews
- 🔒 JWT-based login/register authentication
- 📅 Tour booking and booking management
- 🗺️ Google Maps preview on Tour Details and booking confirmation
- 📍 “Near Me” geolocation-based nearby tour search
- ⚡ Redis caching for high-traffic tour APIs
- 📡 Socket.IO live seat availability updates
- 🎯 Personalized recommendations from booking history
- 🛡️ Security hardening with Helmet + rate limiting
- 📘 Swagger API docs at `/api-docs`
- 🤖 GitHub Actions frontend CI (test + build)

---

## 🛠 Tech Stack

### Frontend
- React.js
- Bootstrap / Reactstrap

### Backend
- Node.js + Express.js
- MongoDB (Mongoose)
- Redis (optional, for caching)
- Socket.IO

---

## ⚙️ Environment Variables (Backend)

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET_KEY` - JWT signing secret
- `PORT` - backend port (optional, defaults to 8000)
- `REDIS_URL` - Redis connection URL (optional but recommended)

---

## 🧪 Run Locally

### Backend
```bash
cd /home/runner/work/Take-My-Trip/Take-My-Trip/tour-management/backend
npm ci
npm run dev
```

### Frontend
```bash
cd /home/runner/work/Take-My-Trip/Take-My-Trip/tour-management/frontend
npm ci
npm start
```

---

## 📚 API Docs

When backend is running, open:

`http://localhost:4000/api-docs`
