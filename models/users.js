// create our user model

// Create the table without the ON UPDATE part:

// CREATE TABLE users (
//   id SERIAL PRIMARY KEY,
//   username VARCHAR(255) UNIQUE NOT NULL,
//   email VARCHAR(255) UNIQUE NOT NULL,
//   password VARCHAR(255) NOT NULL,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
// );

// Create a function to update the updated_at column:

// CREATE OR REPLACE FUNCTION update_updated_at_column()
// RETURNS TRIGGER AS $$
// BEGIN
//     NEW.updated_at = CURRENT_TIMESTAMP;
//     RETURN NEW;
// END;
// $$ LANGUAGE plpgsql;

// Create a trigger that uses this function:

// CREATE TRIGGER update_user_updated_at_before_update
// BEFORE UPDATE ON users
// FOR EACH ROW
// EXECUTE FUNCTION update_updated_at_column();

// CREATE TABLE links (
//   id SERIAL PRIMARY KEY,
//   title VARCHAR(255) NOT NULL,
//   link VARCHAR(255) NOT NULL UNIQUE,
//   destination VARCHAR(255),
//   userId INTEGER,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//   FOREIGN KEY (userId) REFERENCES users(id)
// );