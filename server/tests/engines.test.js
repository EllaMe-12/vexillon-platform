import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import express from 'express';

// Import your ES module routes (Note the mandatory '.js' extension required by ES Modules)
import authRoutes from '../routes/auth.js';
import checkoutRoutes from '../routes/checkout.js';

// Instantiate an isolated testing instance of your server engine
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/checkout', checkoutRoutes);

test('VeXillon Engine End-to-End State Machine Tests', async (t) => {

    // Test 1: Verification of structural email input validation
    await t.test('should reject malformed or blank email payloads', async () => {
        const res = await request(app)
            .post('/api/auth/request-otp')
            .send({ email: 'invalid-email-format' });
        
        assert.equal(res.statusCode, 400);
        assert.match(res.body.error, /Invalid email format/);
    });

    // Test 2: Verification of correct state transition and OTP trigger
    await t.test('should accept clean email strings and advance to AWAITING_VERIFICATION', async () => {
        const res = await request(app)
            .post('/api/auth/request-otp')
            .send({ email: 'DEVELOPER@VEXILLON.AI ' }); // Testing whitespaces and capitalization
        
        assert.equal(res.statusCode, 200);
        assert.equal(res.body.status, 'AWAITING_VERIFICATION');
    });

    // Test 3: Idempotency Protection Check
    await t.test('should drop duplicate webhook settlement triggers to protect state data', async () => {
        const uniqueKey = 'idempotent_test_key_101';
        const payload = {
            orderId: 'VEX-001',
            eventType: 'payment.succeeded',
            idempotencyKey: uniqueKey
        };

        // First payload processing
        const firstCall = await request(app).post('/api/checkout/webhook').send(payload);
        assert.equal(firstCall.statusCode, 200);

        // Identical twin payload interception
        const secondCall = await request(app).post('/api/checkout/webhook').send(payload);
        assert.equal(secondCall.statusCode, 200);
        assert.match(secondCall.body.message, /Duplicate webhook event dropped/);
    });
});