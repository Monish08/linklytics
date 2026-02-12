require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const urlRoutes = require("./routes/urls");

const app = express();
const PORT = process.env.PORT || 5000;

/* Middleware */

app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.CLIENT_URL
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Rate limit */

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many shorts—try again in a minute"
});

app.use("/api/urls/shorten", limiter);

/* Root */

app.get("/", (req,res)=>{
  res.send("Linklytics API running 🚀");
});

/* Routes */

app.use("/api/auth", authRoutes);
app.use("/api/urls", urlRoutes);

/* Start server only after DB connects */

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
  console.log("MongoDB connected");
  app.listen(PORT,()=>console.log(`Server running on ${PORT}`));
})
.catch(err=>{
  console.error(err);
  process.exit(1);
});
