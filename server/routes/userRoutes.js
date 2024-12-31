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

router.post('/register', verifyToken, (req, res) => {
  const { email, name } = req.user;

  try {
    const users = readUsersFromFile();
    let user = users.find((u) => u.email === email);

    if (!user) {
      user = { email, name };
      users.push(user);
      writeUsersToFile(users);
    }

    res.status(201).send(user);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Server error' });
  }
});

module.exports = router;
