// importing modules
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

// PostgreSQL setup
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
})

// signup controller
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // check if email and password are provided
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username or Email or password are required' });
    }

    // check if user and email already exists
    const userExists = await pool.query('SELECT email FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // save user to database
    const user = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// login controller
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // check if user exists
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'User does not exist' });
    }

    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.rows[0].password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // generate token
    const token = jwt.sign({ email: user.rows[0].email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};