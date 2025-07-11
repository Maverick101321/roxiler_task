const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');

// Load env vars
dotenv.config();

// We import the db connection here. The console.log in db.js will
// confirm the connection status when the server starts.
require('./config/db');

// Route files
const authRoutes = require('./routes/auth');
const storeRoutes = require('./routes/stores');

// Middleware
const errorHandler = require('./middleware/error');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// A simple test route to make sure the server is reachable
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections for safety
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});