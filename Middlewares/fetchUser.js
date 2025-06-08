const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const fetchUser = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access Denied' });
    }
    const token = authHeader.split(' ')[1];
    
  if (!token) {
    return res.status(401).json({ error: 'Access Denied' });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.userId = data.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Access Denied' });
  }
};

module.exports = fetchUser;
