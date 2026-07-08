import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import checkoutRoutes from './routes/checkout.js';
import engineRouter from './routes/engines.js';

const app = express();

app.use(cors()); 
app.use(express.json());

// These prefixes add onto the internal route paths
app.use('/api/auth', authRoutes);       // Resulting path: /api/auth/login
app.use('/api/checkout', checkoutRoutes); // Resulting path: /api/checkout/create-order
app.use('/api/engines', engineRouter);   // Resulting path: /api/engines/:route

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`VeXillon backend engine operational on port ${PORT}`);
});