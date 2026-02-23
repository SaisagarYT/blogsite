// Entry point for the backend server
const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({
	origin: "http://localhost:5174",
	credentials: true,
}));

// Initialize MongoDB and Firebase
require("./config/mongodb");
const admin = require("./config/firebase");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Auth routes

// User registration routes
app.use("/api/user", require("./routes/userRegistration"));

app.use("/api/auth", require("./routes/auth"));
