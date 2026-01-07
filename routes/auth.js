const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Configure Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
    callbackURL: '/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ google_id: profile.id });
      
      if (!user) {
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          email_or_phone: profile.emails[0].value,
          google_id: profile.id,
          auth_provider: 'google',
          profile_picture: profile.photos[0]?.value
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign(
      { user_id: req.user.user_id, role: req.user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.redirect(`/?token=${token}`);
  }
);

// Phone OTP Login (Simplified - In production, use Twilio)
router.post('/phone/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }
    
    // In production, generate and send real OTP via Twilio
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in session (in production, use Redis)
    req.session.otp = otp;
    req.session.phone = phone;
    
    console.log(`📱 OTP for ${phone}: ${otp}`);
    
    res.json({ 
      success: true, 
      message: 'OTP sent successfully',
      // Remove this in production!
      dev_otp: otp 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/phone/verify-otp', async (req, res) => {
  try {
    const { phone, otp, name } = req.body;
    
    // Verify OTP
    if (req.session.otp !== otp || req.session.phone !== phone) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    
    // Find or create user
    let user = await User.findOne({ phone });
    
    if (!user) {
      user = await User.create({
        name: name || 'User',
        phone,
        email_or_phone: phone,
        auth_provider: 'phone'
      });
    }
    
    // Clear OTP from session
    delete req.session.otp;
    delete req.session.phone;
    
    // Generate JWT
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email_or_phone: user.email_or_phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ user_id: decoded.user_id }).select('-__v');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.logout(() => {
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

module.exports = router;