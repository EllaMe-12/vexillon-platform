import express from 'express';

const router = express.Router();

const OPERATOR_DATABASE = {
  'leisha@somaiya.edu': {
    password: 'CLOUDSEC99',
    name: 'Leisha Samel',
    ownedEngines: [0, 1]
  }
};

// Use a clean root '/' or '/login' path here
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const account = OPERATOR_DATABASE[email.toLowerCase().trim()];

    if (account && account.password === password) {
      return res.status(200).json({
        success: true,
        user: {
          email: email.toLowerCase().trim(),
          name: account.name,
          ownedEngines: account.ownedEngines
        }
      });
    }
    return res.status(401).json({ error: 'Invalid operator credentials.' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal security fault.' });
  }
});

export default router;