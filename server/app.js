const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const opportunityRoutes = require('./routes/opportunityRoutes');
const teamRoutes = require('./routes/teamRoutes');
const projectRoutes = require('./routes/projectRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

const app = express();

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS policy
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// HTTP Request Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve uploaded static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const mongoose = require('mongoose');
const DIRECT_ATLAS_URI =
  'mongodb://harshvardhan:Harsh%40123@ac-hq3np4o-shard-00-00.1ummtqf.mongodb.net:27017,ac-hq3np4o-shard-00-01.1ummtqf.mongodb.net:27017,ac-hq3np4o-shard-00-02.1ummtqf.mongodb.net:27017/campusconnect?ssl=true&replicaSet=atlas-1ck0dq-shard-0&authSource=admin&retryWrites=true&w=majority';

// Auto-reconnect middleware
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState === 0) {
    try {
      const uri = process.env.MONGO_URI || DIRECT_ATLAS_URI;
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    } catch (e) {
      try {
        await mongoose.connect(DIRECT_ATLAS_URI, { serverSelectionTimeoutMS: 5000 });
      } catch (err) {}
    }
  }
  next();
});

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  if (mongoose.connection.readyState === 0) {
    try {
      const uri = process.env.MONGO_URI || DIRECT_ATLAS_URI;
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    } catch (e) {
      try {
        await mongoose.connect(DIRECT_ATLAS_URI, { serverSelectionTimeoutMS: 5000 });
      } catch (err) {}
    }
  }
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    success: true,
    message: 'CampusConnect API Gateway is running smoothly',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Root welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to CampusConnect API Server. Explore opportunities, teams, and projects!',
    health: '/api/health',
  });
});

// Mount Module Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/teams', teamRoutes);
// Direct alias for request management: /api/requests/:id
app.use('/api/requests', (req, res, next) => {
  req.url = `/requests${req.url}`;
  teamRoutes(req, res, next);
});
app.use('/api/projects', projectRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
