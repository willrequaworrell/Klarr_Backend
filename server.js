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

const corsOptions = {
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// app.options('*', cors());
app.use(express.json());
app.use('/api/tasks', taskRoutes)
app.use('/', baseRoutes)

const PORT = process.env.PORT || 3000;

connectDB();


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));