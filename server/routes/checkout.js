import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const router = express.Router();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Clean root path: /api/checkout/create-order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const options = {
      amount: Math.round(amount * 100), 
      currency: currency || 'INR',
      receipt: `rec_${crypto.randomBytes(6).toString('hex')}`,
    };
    const order = await razorpayInstance.orders.create(options);
    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ error: 'Gateway order generation failure.' });
  }
});

// Clean root path: /api/checkout/verify-payment
// Clean root path: /api/checkout/verify-payment
router.post('/verify-payment', async (req, res) => {
  try {
    console.log("Incoming Verification Payload:", req.body);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Force strict primitive string concatenation
    const secureTokenPayload = String(razorpay_order_id) + '|' + String(razorpay_payment_id);
    
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(secureTokenPayload)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      return res.status(200).json({ success: true });
    }
    return res.status(400).json({ success: false, error: 'Signature mismatch.' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal validation failure.' });
  }
});

export default router;