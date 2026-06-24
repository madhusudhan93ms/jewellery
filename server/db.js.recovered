import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

// ─── MONGOOSE CONNECTION ─────────────────────────────────────────────────────

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/vjs';
  await mongoose.connect(uri);
  isConnected = true;
  console.log(`✅ MongoDB connected: ${uri}`);
}

// ─── SCHEMAS & MODELS ────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  status: { type: String, enum: ['active', 'disabled'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  userId: { type: String, required: true },
  userEmail: String,
  userName: String,
  items: [
    {
      id: String,
      name: String,
      price: Number,
      quantity: Number,
      image: String,
      category: String
    }
  ],
  total: { type: Number, required: true },
  subtotal: Number,
  gst: Number,
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  paymentMethod: { type: String, enum: ['Razorpay', 'COD'], default: 'COD' },
  paymentId: String,
  razorpayOrderId: String,
  invoiceNumber: { type: String, unique: true, sparse: true },
  status: {
    type: String,
    enum: ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Placed'
  },
  createdAt: { type: Date, default: Date.now }
});

const cartSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  items: { type: Array, default: [] }
});

const wishlistSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  items: { type: Array, default: [] }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
const Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);

// ─── SEED ADMIN USER ─────────────────────────────────────────────────────────

export async function seedAdmin() {
  const existing = await User.findOne({ role: 'admin' });
  if (!existing) {
    const passwordHash = bcrypt.hashSync('admin123', 10);
    await User.create({
      id: 'USR-ADMIN',
      name: 'VJS Admin',
      email: 'admin@vjs.com',
      phone: '9999999999',
      passwordHash,
      role: 'admin',
      status: 'active'
    });
    console.log('🔑 Admin seeded: admin@vjs.com / admin123');
  }
}

// ─── INVOICE COUNTER ─────────────────────────────────────────────────────────

async function generateInvoiceNumber() {
  const count = await Order.countDocuments();
  const year = new Date().getFullYear();
  return `VJS-INV-${year}-${String(count + 1).padStart(5, '0')}`;
}

// ─── DB OPERATIONS ───────────────────────────────────────────────────────────

export const db = {
  // --- USERS ---
  async getUsers() {
    return User.find({}).lean();
  },

  async getUserByEmail(email) {
    return User.findOne({ email: email.toLowerCase() }).lean();
  },

  async getUserById(id) {
    return User.findOne({ id }).lean();
  },

  async createUser({ name, email, phone, password, role = 'user' }) {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) throw new Error('Email is already registered.');

    const id = 'USR-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const passwordHash = bcrypt.hashSync(password, 10);
    const newUser = await User.create({ id, name, email, phone, passwordHash, role });
    const { passwordHash: _, ...safe } = newUser.toObject();
    return safe;
  },

  async toggleUserStatus(userId) {
    const user = await User.findOne({ id: userId });
    if (!user) throw new Error('User not found.');
    if (user.role === 'admin') throw new Error('Cannot disable an admin account.');
    user.status = user.status === 'active' ? 'disabled' : 'active';
    await user.save();
    return user.toObject();
  },

  // --- CARTS ---
  async getCart(userId) {
    const cart = await Cart.findOne({ userId }).lean();
    return cart ? cart.items : [];
  },

  async saveCart(userId, items) {
    await Cart.findOneAndUpdate({ userId }, { items }, { upsert: true, new: true });
    return items;
  },

  // --- WISHLISTS ---
  async getWishlist(userId) {
    const wl = await Wishlist.findOne({ userId }).lean();
    return wl ? wl.items : [];
  },

  async saveWishlist(userId, items) {
    await Wishlist.findOneAndUpdate({ userId }, { items }, { upsert: true, new: true });
    return items;
  },

  // --- ORDERS ---
  async getOrders(userId) {
    return Order.find({ userId }).sort({ createdAt: -1 }).lean();
  },

  async getAllOrders() {
    return Order.find({}).sort({ createdAt: -1 }).lean();
  },

  async getOrderById(orderId) {
    return Order.findOne({ id: orderId }).lean();
  },

  async createOrder(userId, { items, total, shippingAddress, paymentMethod = 'COD', paymentId = null, razorpayOrderId = null }) {
    const user = await User.findOne({ id: userId });
    if (!user) throw new Error('User not found.');

    const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const invoiceNumber = await generateInvoiceNumber();

    // Calculate GST (3% on jewellery)
    const subtotal = total;
    const gst = Math.round(subtotal * 0.03 * 100) / 100;
    const grandTotal = Math.round((subtotal + gst) * 100) / 100;

    const newOrder = await Order.create({
      id: orderId,
      userId,
      userEmail: user.email,
      userName: user.name,
      items,
      subtotal,
      gst,
      total: grandTotal,
      shippingAddress,
      paymentMethod,
      paymentId,
      razorpayOrderId,
      invoiceNumber,
      status: 'Placed'
    });

    // Clear cart after order
    await Cart.findOneAndUpdate({ userId }, { items: [] });

    return newOrder.toObject();
  },

  async updateOrderStatus(orderId, status) {
    const order = await Order.findOneAndUpdate({ id: orderId }, { status }, { new: true });
    if (!order) throw new Error('Order not found.');
    return order.toObject();
  }
};
