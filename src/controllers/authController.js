const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, JWT_SECRET, FRONTEND_URL } = process.env;

exports.facebookLogin = async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "No authorization code provided" });
  try {
    const tokenResponse = await axios.get("https://graph.facebook.com/oauth/access_token", {
      params: {
        client_id: FACEBOOK_APP_ID,
        client_secret: FACEBOOK_APP_SECRET,
        redirect_uri: `${FRONTEND_URL}/auth/facebook/callback`,
        code,
      },
    });
    const accessToken = tokenResponse.data.access_token;
    const userResponse = await axios.get("https://graph.facebook.com/me", {
      params: { access_token: accessToken, fields: "id,name,email,picture" },
    });
    const user = userResponse.data;
    console.log("user",user)
    let existingUser = await User.findOne({ email: user.email });
    if (!existingUser) {
      existingUser = new User({ name: user.name, email: user.email, password: "", picture: user.picture.data.url, facebookId: user.id });
      await existingUser.save();
    }
    const jwtToken = jwt.sign(
      { id: existingUser._id, name: existingUser.name, email: existingUser.email,picture: user.picture.data.url, facebookId: user.id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token: jwtToken, user: existingUser });
  } catch (error) {
    console.error("Facebook login error:", error);
    res.status(400).json({ error: "Authentication failed" });
  }
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "All fields are required" });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  res.json({ message: "User registered successfully" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
  const jwtToken = jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.json({ token: jwtToken, user });
};