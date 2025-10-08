const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    console.log('Auth middleware: Header received:', authHeader ? 'Yes' : 'No');

    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      console.log('Auth: No token found');
      return res.status(401).json({ error: 'No token, access denied' });
    }

    console.log('Auth: Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth: Decoded payload:', { userId: decoded.userId });

    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log('Auth: User not found for ID:', decoded.userId);
      return res.status(401).json({ error: 'Invalid token' });
    }

    console.log('Auth: User loaded, proceeding to route');
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message, err.stack);
    res.status(401).json({ error: 'Token invalid' });
  }
};

module.exports = auth;