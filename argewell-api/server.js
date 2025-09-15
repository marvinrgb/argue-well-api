require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/arguments', require('./routes/argument.routes'));
app.use('/api/coach', require('./routes/coach.routes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
