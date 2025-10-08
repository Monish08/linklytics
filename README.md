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

<image-card alt="Screenshot" src="screenshot.png" ></image-card>  <!-- Add a screenshot here if you have one -->

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

Create .env:
