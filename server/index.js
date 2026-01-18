const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config(); // <--- IMPORT DOTENV HERE

const app = express();
app.use(express.json());
app.use(cors());

// --- CONFIGURATION (UPDATED) ---
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// --- DATABASE CONNECTION ---
mongoose.connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', UserSchema);

// --- NODEMAILER TRANSPORTER (UPDATED) ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // <--- READ FROM ENV
    pass: process.env.EMAIL_PASS  // <--- READ FROM ENV
  }
});

// --- AUTH ROUTES ---

// 1. SIGN UP
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({ name, email, password: hashedPassword });
    const token = jwt.sign({ email: newUser.email, id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ result: newUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// 2. SIGN IN
app.post('/api/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(404).json({ message: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// 3. FORGOT PASSWORD
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '15m' });
    
    // UPDATED: Uses CLIENT_URL from env
    const resetLink = `${CLIENT_URL}/reset-password/${token}`;

    const mailOptions = {
      from: `"VFXB Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset - VFXB',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Reset Your Password</h2>
          <p>Hello ${user.name || 'User'},</p>
          <p>We received a request to reset your password. Click the button below to continue:</p>
          <a href="${resetLink}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Reset Password</a>
          <p>This link will expire in 15 minutes.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Reset link sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

// 4. RESET PASSWORD
app.post('/api/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const hashedPassword = await bcrypt.hash(password, 12);
    
    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });
    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Link expired or invalid token" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port: ${PORT}`));