// importing modules
require('dotenv').config();
const { Pool } = require('pg');

// PostgreSQL setup
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
})

// create link controller
exports.createLink = async (req, res) => {
  // create random link, for example shorter.link/3VYNxif, the random link is can be 8 or 12 characters
  const link = Math.random().toString(36).substring(2, 8);

  try {
    const { title, destination, userId } = req.body;

    // check if title and url are provided
    if (!destination || !title) {
      return res.status(400).json({ error: 'Title and Destination are required' });
    }

    // check if link already exists, if it does, generate a new one
    let uniqueLinkFound = false;
    do {
      const linkExists = await pool.query('SELECT link FROM links WHERE link = $1', [link]);
      if (linkExists.rows.length > 0) {
        // If the link exists, generate a new one and check again
        link = Math.random().toString(36).substring(2, 8);
      } else {
        // If the link does not exist, exit the loop
        uniqueLinkFound = true;
      }
    } while (!uniqueLinkFound);

    // save link to database
    const response = await pool.query(
      'INSERT INTO links (title, link, destination, userId) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, link, destination, userId]
    );

    res.status(201).json({ message: 'Link created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get all links controller for a specific user
exports.getAllLinks = async (req, res) => {
  const { username } = req.params;

  try {
    // Join users and links tables to get all links for the user
    const query = `
      SELECT links.*
      FROM links
      JOIN users ON users.id = links.userId
      WHERE users.username = $1 LIMIT 50
    `;
    const links = await pool.query(query, [username]);

    if (links.rows.length === 0) {
      return res.status(404).json({ error: 'No links found for user or user not found' });
    }

    res.status(200).json({ links: links.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
