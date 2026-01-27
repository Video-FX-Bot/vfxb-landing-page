const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library'); // Import Google Lib
const msal = require('@azure/msal-node');               // Microsoft
const fetch = require('node-fetch');                    // For Microsoft Graph

require('dotenv').config();

const app = express();

// --- MIDDLEWARE ---
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173', // Vite default port
    'http://localhost:3000'  // Create React App default port
  ],
  credentials: true
}));

// --- CONFIGURATION ---
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID; // Must match Frontend ID
const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID;
const MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET;
const MICROSOFT_REDIRECT_URI = process.env.MICROSOFT_REDIRECT_URI;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// --- GOOGLE CLIENT SETUP ---
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// --- MICROSOFT CLIENT SETUP ---
const msalConfig = {
  auth: {
    clientId: MICROSOFT_CLIENT_ID,
    authority: 'https://login.microsoftonline.com/common',
    clientSecret: MICROSOFT_CLIENT_SECRET,
  },
};
const cca = new msal.ConfidentialClientApplication(msalConfig);

// --- DATABASE CONNECTION ---
mongoose.connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// --- USER SCHEMA ---
const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Not required (for Google Users)
  profilePicture: { type: String }
});
const User = mongoose.model('User', UserSchema);

// --- NODEMAILER SETUP ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ================= ROUTES ================= //

// 1. SIGN UP (Email/Password)
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const newUser = await User.create({ 
      name, 
      email, 
      password: hashedPassword,
      profilePicture: null 
    });

    const token = jwt.sign({ email: newUser.email, id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ result: newUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// 2. SIGN IN (Email/Password)
app.post('/api/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(404).json({ message: "User not found" });

    // If user created account via Google, they might not have a password
    if (!existingUser.password) {
      return res.status(400).json({ message: "Please sign in with Google" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, JWT_SECRET, { expiresIn: '1h' });
    
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// 3. GOOGLE AUTH LOGIN
app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body; // Token sent from Frontend

  try {
    // A. Verify the token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID, 
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // B. Check if user exists in DB
    let user = await User.findOne({ email });

    if (!user) {
      // C. If not, create new user (No password)
      user = await User.create({
        name,
        email,
        profilePicture: picture,
      });
    }

    // D. Generate JWT for our app
    const jwtToken = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    
    res.status(200).json({ result: user, token: jwtToken });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ message: "Invalid Google Token" });
  }
});


// 4. MICROSOFT AUTH LOGIN URL
app.get('/api/auth/microsoft/url', (req, res) => {
  const authCodeUrlParameters = {
    scopes: ["user.read"],
    redirectUri: MICROSOFT_REDIRECT_URI,
  };

  cca.getAuthCodeUrl(authCodeUrlParameters)
    .then((url) => res.json({ url }))
    .catch((error) => {
      console.error("Microsoft Auth URL Error:", error);
      res.status(500).json({ message: "Failed to get Microsoft login URL" });
    });
});

// 5. MICROSOFT AUTH CALLBACK (returns JWT in JSON)
app.get('/api/auth/microsoft/callback', async (req, res) => {
  const authCode = req.query.code;
  const tokenRequest = { code: authCode, scopes: ["user.read"], redirectUri: MICROSOFT_REDIRECT_URI };

  try {
    // 1️⃣ Exchange auth code for access token
    const response = await cca.acquireTokenByCode(tokenRequest);
    const accessToken = response.accessToken;

    // 2️⃣ Fetch user profile from Microsoft Graph
    const graphResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userData = await graphResponse.json();

    const email = userData.mail || userData.userPrincipalName;
    const name = userData.displayName;

    // 3️⃣ Check if user exists in DB, create if not
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, profilePicture: null });
    }

    // 4️⃣ Generate JWT
    const jwtToken = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    // 5️⃣ Return user info + JWT in JSON (like Google login)
    res.status(200).json({ result: user, token: jwtToken });

  } catch (error) {
    console.error("Microsoft Auth Error:", error);
    res.status(401).json({ message: "Microsoft login failed" });
  }
});


// 6. FORGOT PASSWORD
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '15m' });
    const resetLink = `${CLIENT_URL}/reset-password/${token}`;

    const mailOptions = {
      from: `"VFXB Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset - VFXB',
      html: `
        <h2>Reset Your Password</h2>
        <p>Click below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Reset link sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

// 7. RESET PASSWORD
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