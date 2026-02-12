# 🔗 Linklytics

Linklytics is a full-stack URL shortener with analytics built using the MERN stack + Vite.  
Create secure, trackable short links with features like expiration, password protection, and QR sharing.

---

## 🌐 Live Demo
Frontend → https://linklytics-ecru.vercel.app  
Backend → https://linklytics-api.onrender.com

---

## ✨ Features
- Shorten URLs with custom aliases
- Analytics (clicks, referrer, geo data)
- Password-protected links
- Expiry date + click limits
- Batch URL shortening
- QR code generation
- WhatsApp sharing
- Dark mode UI
- Responsive design

---

## 🛠 Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS
- shadcn/ui
- Axios

**Backend**
- Node.js
- Express
- MongoDB Atlas

**Libraries**
- bcrypt
- nanoid
- geoip-lite
- qrcode.react

---

## 🚀 Run Locally

### Clone repo
```bash
git clone https://github.com/Monish08/linklytics.git
cd linklytics
```

---

### Backend setup
```bash
cd backend
npm install
```

Create `.env`
```
MONGODB_URI=your_uri
JWT_SECRET=your_secret
PORT=5000
```

Run:
```bash
node server.js
```

---

### Frontend setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🔧 Deployment

### Frontend (Vercel)
- Import repo
- Root directory → `frontend`
- Add env:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

---

### Backend (Render)
- Root directory → `backend`
- Add env:
```
MONGODB_URI
JWT_SECRET
CLIENT_URL=https://linklytics-ecru.vercel.app
```

---

## 📌 Highlights
- JWT authentication
- Rate-limited API
- Geo tracking analytics
- Production-ready deployment

---

## 📜 License
MIT
