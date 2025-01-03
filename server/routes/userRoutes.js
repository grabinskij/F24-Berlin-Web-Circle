const express = require('express');
const fs = require('fs');
const path = require('path');
const verifyToken = require('../middleware/auth'); 

const router = express.Router();

const usersFilePath = path.join(__dirname, '../src/data/users.json');

const readUsersFromFile = () => {
  const data = fs.readFileSync(usersFilePath, 'utf-8');
  return JSON.parse(data);
};

const writeUsersToFile = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

router.post('/register', verifyToken, async (req, res) => {
  try {
    const { name, surname } = req.body;
    const email = req.user?.email;

    if (!name || !surname || !email) {
      return res.status(400).json({ 
        error: 'Name, surname, and email are required.' 
      });
    }

    const users = readUsersFromFile();

    let user = users.find((u) => u.email === email);

    if (!user) {
      user = {
        userId: users.length + 1, 
        email,
        name,
        surname,
        createdAt: new Date().toISOString(),
      };

      users.push(user);

      writeUsersToFile(users);
    } else {
      user.name = name;
      user.surname = surname;

      writeUsersToFile(users);
    }

    res.status(201).send(user);

  } catch (error) {
    console.error('Error processing request:', error.message);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
});

module.exports = router;
