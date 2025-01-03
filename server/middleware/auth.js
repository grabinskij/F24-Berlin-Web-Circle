const admin = require('../firebase/firebase.js'); 

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    return res.status(403).send({ message: 'Unauthorized' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      next();
  } catch (error) {
      console.error('Token verification failed:', error);
      res.status(403).send({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;


