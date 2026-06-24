import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import { connectDB, seedAdmin, db } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'vjs-jewellery-secret-key-12345';

// Razorpay instance (uses test keys if not set)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret'
});

app.use(cors());
app.use(express.json());

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token required.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await db.getUserById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.status === 'disabled')
      return res.status(403).json({ message: 'Your account has been disabled. Please contact support.' });
    const { passwordHash, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
}

// ─── AUTH ENDPOINTS ───────────────────────────────────────────────────────────

// Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password)
    return res.status(400).json({ message: 'All fields are required.' });
  try {
    const user = await db.createUser({ name, email, phone, password });
    res.status(201).json({ message: 'Registration successful.', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required.' });
  try {
    const user = await db.getUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' });
    if (user.status === 'disabled')
      return res.status(403).json({ message: 'Your account has been disabled. Please contact support.' });

    const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid email or password.' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '24h'
    });
    const { passwordHash, ...userWithoutPassword } = user;
    res.json({ message: 'Login successful.', token, user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred during login.' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// ─── CART ENDPOINTS ───────────────────────────────────────────────────────────

app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const cart = await db.getCart(req.user.id);
    res.json({ cart });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve cart.' });
  }
});

app.post('/api/cart', authenticateToken, async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) return res.status(400).json({ message: 'Invalid cart format.' });
  try {
    const updatedCart = await db.saveCart(req.user.id, items);
    res.json({ message: 'Cart synced.', cart: updatedCart });
  } catch (err) {
    res.status(500).json({ message: 'Failed to sync cart.' });
  }
});

// ─── WISHLIST ENDPOINTS ───────────────────────────────────────────────────────

app.get('/api/wishlist', authenticateToken, async (req, res) => {
  try {
    const wishlist = await db.getWishlist(req.user.id);
    res.json({ wishlist });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve wishlist.' });
  }
});

app.post('/api/wishlist', authenticateToken, async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) return res.status(400).json({ message: 'Invalid wishlist format.' });
  try {
    const updatedWishlist = await db.saveWishlist(req.user.id, items);
    res.json({ message: 'Wishlist synced.', wishlist: updatedWishlist });
  } catch (err) {
    res.status(500).json({ message: 'Failed to sync wishlist.' });
  }
});

// ─── ORDERS ENDPOINTS ─────────────────────────────────────────────────────────

// Get user's orders
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await db.getOrders(req.user.id);
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve orders.' });
  }
});

// Create order (COD)
app.post('/api/orders', authenticateToken, async (req, res) => {
  const { items, total, shippingAddress, paymentMethod } = req.body;
  if (!items || !total || !shippingAddress)
    return res.status(400).json({ message: 'Items, total, and shipping address are required.' });
  try {
    const newOrder = await db.createOrder(req.user.id, {
      items,
      total,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD'
    });
    res.status(201).json({ message: 'Order placed successfully.', order: newOrder });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ─── PAYMENT ENDPOINTS ────────────────────────────────────────────────────────

// Create Razorpay order
app.post('/api/payment/create-order', authenticateToken, async (req, res) => {
  const { amount } = req.body; // amount in rupees
  if (!amount) return res.status(400).json({ message: 'Amount is required.' });

  try {
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.user.id,
        userEmail: req.user.email
      }
    };
    const order = await razorpay.orders.create(options);
    res.json({
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error('Razorpay order creation error:', err);
    res.status(500).json({ message: 'Failed to create payment order. Check Razorpay credentials.' });
  }
});

// Verify Razorpay payment and save order
app.post('/api/payment/verify', authenticateToken, async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    items,
    total,
    shippingAddress
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
    return res.status(400).json({ message: 'Payment verification data is incomplete.' });

  try {
    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed. Invalid signature.' });
    }

    // Save order in DB
    const newOrder = await db.createOrder(req.user.id, {
      items,
      total,
      shippingAddress,
      paymentMethod: 'Razorpay',
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id
    });

    res.status(201).json({ message: 'Payment verified and order placed!', order: newOrder });
  } catch (err) {
    console.error('Payment verify error:', err);
    res.status(500).json({ message: err.message || 'Failed to verify payment.' });
  }
});

// ─── ADMIN ENDPOINTS ──────────────────────────────────────────────────────────

// Get all users
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await db.getUsers();
    const safeUsers = users.map(({ passwordHash, ...user }) => user);
    res.json({ users: safeUsers });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve users.' });
  }
});

// Toggle user status
app.post('/api/admin/users/:id/toggle', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await db.toggleUserStatus(req.params.id);
    res.json({ message: `User status changed to ${user.status}.`, status: user.status });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all orders
app.get('/api/admin/orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const orders = await db.getAllOrders();
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve orders.' });
  }
});

// Update order status
app.put('/api/admin/orders/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status))
    return res.status(400).json({ message: 'Invalid status value.' });
  try {
    const order = await db.updateOrderStatus(req.params.id, status);
    res.json({ message: `Order status updated to ${status}.`, order });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get single order (for invoice)
app.get('/api/admin/orders/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const order = await db.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve order.' });
  }
});

// Get user's own order (for invoice download)
app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const order = await db.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    // Only allow user to see their own order (or admin)
    if (order.userId !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Access denied.' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve order.' });
  }
});

// ─── START SERVER ─────────────────────────────────────────────────────────────

async function startServer() {
  try {
    await connectDB();
    await seedAdmin();
    app.listen(PORT, () => {
      console.log(`🚀 VJS Jewellery Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
