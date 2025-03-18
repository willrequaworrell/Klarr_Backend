require('dotenv').config();
const rateLimit = require('express-rate-limit');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const taskRoutes = require('./routes/taskRoutes')
const baseRoutes = require('./routes/baseRoutes')
const userPreferencesRoutes = require('./routes/userPreferencesRoutes');


const app = express();


const allowedOrigins = [
    'https://klarr.vercel.app',
    'https://www.klarr.app',
    'http://localhost:5173' // for local development
];

const captureResponse = (req, res, next) => {
    const oldJson = res.json;
    res.json = function (data) {
      const capturedResponse = {
        request: {
          method: req.method,
          url: req.url,
          headers: req.headers,
          body: req.body
        },
        response: {
          statusCode: res.statusCode,
          headers: res.getHeaders(),
          body: data
        }
      };
      console.log('Captured Request/Response:', JSON.stringify(capturedResponse, null, 2));
      return oldJson.call(this, data);
    };
    next();
  };

app.use(captureResponse)


app.use(cors({
    origin: function (origin, callback) {
      console.log(origin, "<----------------")
      // allow requests with no origin 
      // (like mobile apps or curl requests)
      if (!origin) {
        console.log('Request has no origin');
        return callback(null, true);
      }
      if (!allowedOrigins.includes(origin)) {
        var msg = 'The CORS policy for this site does not ' +
                  'allow access from the specified Origin.';
        console.log(msg);  // Log the error message
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  headers: true, // Send rate limit headers in responses
  keyGenerator: (req) => req.ip, // Use the IP address as the key
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      message: options.message,
      rateLimit: {
        max: options.max,
        windowMs: options.windowMs,
      },
    });
  },
});

app.use(limiter);

app.use('/api/tasks', taskRoutes)
app.use('/', baseRoutes)
app.use('/api/preferences', userPreferencesRoutes);

const PORT = process.env.PORT || 3000;

connectDB();


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));