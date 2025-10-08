# Linklytics 🧬

Linklytics is a modern, full-stack URL shortener with analytics. Built with MERN (MongoDB, Express, React, Node.js) + Vite for fast dev. Features password protection, max clicks, auto-expire, batch shortening, QR codes, and WhatsApp sharing.

## ✨ Features
- **Shorten URLs**: Auto-generate codes or custom aliases.
- **Analytics**: Track clicks, referrers, IP, geo (country/city).
- **Security**: Password-protected links with prompt page.
- **Limits**: Max clicks (auto-delete after X) + auto-expire by date.
- **Batch Mode**: Shorten multiple URLs at once.
- **QR & Share**: Generate QR codes, copy links, share via WhatsApp.
- **Dark Mode**: shadcn/ui theme toggle.
- **Responsive**: Mobile-friendly with Tailwind CSS.

## 🛠 Tech Stack
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + Sonner (toasts)
- **Backend**: Node.js + Express + MongoDB (Atlas)
- **Other**: bcrypt (hashing), nanoid (codes), geoip-lite (geo), qrcode.react (QR)
- **Deployment**: Vercel (frontend), Render (backend)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- GitHub account for deployment

### Backend Setup
1. Clone repo and cd to `backend/`:
   ```bash
   cd backend
   npm install
   ```
2. Create `.env`:
   ```bash
   MONGODB_URI=your-mongodb-uri
   PORT=5000
   JWT_SECRET=your-jwt-secret
   ```
3. Run:
   ```bash
   node server.js
   ```
   Backend on http://localhost:5000.

### Frontend Setup
1. Cd to `frontend/`:
   ```bash
   cd frontend
   npm install
   ```
2. Update `src/api.js` baseURL if backend port changes.  
3. Run:
   ```bash
   npm run dev
   ```
   Frontend on http://localhost:5173.

### Testing
- Signup/Login at /login.
- Shorten URL in dashboard—test batch, password, expire.
- Analytics at /analytics/[code].
- Protected: Visit shortLink → Password prompt → Enter pw → Opens original.

## 🔧 Deployment

### Frontend (Vercel)
1. Push to GitHub.
2. Vercel dashboard > Import repo > Deploy (auto-detects Vite).
3. Add env var `VITE_API_URL=your-backend-url/api`.

### Backend (Render)
1. Push backend to GitHub.
2. Render dashboard > New Web Service > Connect repo > Node environment.
3. Add env vars (MONGODB_URI, JWT_SECRET).
4. Deploy—URL like `linklytics-backend.onrender.com`.

## 📁 Project Structure
```
linklytics/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── api.js
│   │   └── App.jsx
│   ├── vite.config.js
│   └── index.css
├── .gitignore
└── README.md
```

## 🤝 Contributing
Fork, PR, or open issues. Tests with Postman for backend routes.

## 📄 License
MIT License—feel free to use/modify.

Built with ❤️ by Mickey. Questions? Open an issue!
