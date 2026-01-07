const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth');
const User = require('../models/User');
const Report = require('../models/Report');

// Get all users (Admin only)
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-__v').sort({ created_at: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all reports (Admin only)
router.get('/reports', authenticateToken, isAdmin, async (req, res) => {
  try {
    const reports = await Report.find().select('-__v').sort({ timestamp: -1 });
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard statistics (Admin only)
router.get('/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalReports = await Report.countDocuments();
    
    // Status distribution
    const healthyCount = await Report.countDocuments({ status: 'Healthy' });
    const diseasedCount = await Report.countDocuments({ status: 'Diseased' });
    
    // Disease category distribution
    const diseaseDistribution = await Report.aggregate([
      { $match: { status: 'Diseased' } },
      { $group: { _id: '$disease_name', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Recent activity
    const recentReports = await Report.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .select('report_id user_name status disease_name timestamp');
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        totalReports,
        healthyCount,
        diseasedCount,
        diseaseDistribution: diseaseDistribution.map(d => ({
          disease: d._id,
          count: d.count
        })),
        recentReports
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;