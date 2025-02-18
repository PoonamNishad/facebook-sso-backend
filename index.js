
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const { MONGO_URI } = process.env;

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use(
  cors({
    origin: ["http://localhost:3000", "https://facebook-sso.vercel.app", "http://fb-sso-fcdnb5duaze3bshn.canadacentral-01.azurewebsites.net"],
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true, 
  })
);

app.use(express.json());

// Routes
app.use("/auth", require("./src/routers/authRouters"));
app.use("/user", require("./src/routers/userRoutes"));

app.listen(5001, () => console.log("Server running on http://localhost:5001"));
