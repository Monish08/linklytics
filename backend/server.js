const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const urlRoutes = require('./routes/urls');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting: 10 shorts per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,  
  max: 10,              
  message: 'Too many shorts—try again in a minute',
  standardHeaders: true,
  legacyHeaders: false
});

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],  
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  

// Apply rate limit to /api/urls/shorten
app.use('/api/urls/shorten', limiter);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Mongo connect error:', err));
app.get("/", (req,res)=>{
  res.send("Linklytics API running 🚀");
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
