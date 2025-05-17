const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];  
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {

    const decoded = jwt.verify(token, JWT_SECRET );
    
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

exports.adminOnly = (req, res, next) => {
  console.log(req.user.role)
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Admins only' });
  next();
};
