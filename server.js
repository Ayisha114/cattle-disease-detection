const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'cattle-detection-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection (Optional - only if you want to save reports)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cattle-detection';
if (process.env.MONGODB_URI) {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.log('⚠️  MongoDB Connection Error (running without database):', err.message));
} else {
  console.log('ℹ️  Running without MongoDB (no database configured)');
}

// Routes
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const uploadNoAuthRoutes = require('./routes/upload-no-auth');
const reportRoutes = require('./routes/reports');
const adminRoutes = require('./routes/admin');

// No-auth upload route (primary)
app.use('/api/upload', uploadNoAuthRoutes);

// Auth routes (for future use)
app.use('/api/auth', authRoutes);
app.use('/api/upload-auth', uploadRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Cattle Disease Detection API is running',
    timestamp: new Date().toISOString(),
    mode: 'No Authentication Required'
  });
});

// Serve no-auth frontend as default
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index-no-auth.html'));
});

// Serve auth frontend
app.get('/auth', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index-no-auth.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 API available at: http://localhost:${PORT}/api`);
  console.log(`🔓 No authentication required - Direct upload enabled`);
  console.log(`🎨 Professional UI available at: http://localhost:${PORT}`);
});