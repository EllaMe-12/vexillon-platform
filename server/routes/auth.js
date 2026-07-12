import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

const OPERATOR_DATABASE = {
  'leisha@somaiya.edu': {
    password: 'CLOUDSEC99',
    name: 'Leisha Samel',
    ownedEngines: [0, 1]
  }
};

router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Please fill in all security credentials.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const account = OPERATOR_DATABASE[normalizedEmail];

    if (account && account.password === password) {
      const userPayload = {
        email: normalizedEmail,
        name: account.name,
        ownedEngines: account.ownedEngines
      };

      // Sign the session token securely
      const token = jwt.sign(
        userPayload, 
        process.env.JWT_SECRET, 
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        success: true,
        token,
        user: userPayload
      });
    }
    
    return res.status(401).json({ error: 'Invalid operator credentials.' });
  } catch (error) {
    console.error('[Auth Error]:', error);
    return res.status(500).json({ error: 'Internal security fault.' });
  }
});

export default router;