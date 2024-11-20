require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const taskRoutes = require('./routes/taskRoutes')
const baseRoutes = require('./routes/baseRoutes')
//test
const app = express();

const allowedOrigins = [
    'https://klarr.vercel.app',
    'http://localhost:3000' // for local development
];

const captureResponse = (req, res, next) => {
    const oldJson = res.json;
    res.json = function (data) {
      const capturedResponse = {
        statusCode: res.statusCode,
        headers: res.getHeaders(),
        body: data
      };
      console.log('Captured Response:', JSON.stringify(capturedResponse, null, 2));
      return oldJson.call(this, data);
    };
    next();
  };
  
app.use(captureResponse)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

// app.options('*', cors());
app.use(express.json());
app.use('/api/tasks', taskRoutes)
app.use('/', baseRoutes)

const PORT = process.env.PORT || 3000;

connectDB();


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));