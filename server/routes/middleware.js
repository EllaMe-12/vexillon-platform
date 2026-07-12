import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // Extract token from 'Bearer <token>' format
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Security token missing.' });
  }

  try {
    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verifiedUser; // Inject user session metadata into request context
    next(); 
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired security signature.' });
  }
};