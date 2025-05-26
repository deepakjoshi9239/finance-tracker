const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '').trim();

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is required' });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || "9bc792702f9e0f7f143f6b940fc72068f2175540cce97cb10a8a8b4a0cdcdbc5";
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { authenticateUser };
