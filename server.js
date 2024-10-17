require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const taskRoutes = require('./routes/taskRoutes')
const baseRoutes = require('./routes/baseRoutes')

const app = express();



app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use('/api/tasks', taskRoutes)
app.use('/', baseRoutes)

const PORT = process.env.PORT || 3000;

connectDB();

// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('Error connecting to MongoDB:', err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));