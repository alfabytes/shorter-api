require('dotenv').config();
const express = require('express');

const userRoutes = require('./routes/userRoutes');
const linkRoutes = require('./routes/linkRoutes');

const PORT = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/links', linkRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
