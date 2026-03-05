/* eslint-env node */
// Entry point for the backend server
const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(express.json());

const defaultAllowedOrigins = [
	"http://localhost:5173",
	"http://localhost:5174",
	"http://localhost:8080",
	"https://keenshot.vercel.app",
	"https://blogsite-sdql.onrender.com",
];

const envAllowedOrigins = (process.env.CORS_ORIGINS || "")
	.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envAllowedOrigins])];

const isAllowedOrigin = (origin) => {
	if (!origin) return true;
	if (allowedOrigins.includes(origin)) return true;
	if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) return true;
	return false;
};

const corsOptions = {
	origin: (origin, callback) => {
		if (isAllowedOrigin(origin)) {
			return callback(null, true);
		}
		return callback(new Error("Not allowed by CORS"));
	},
	credentials: true,
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.get("/health", (req, res) => {
	res.status(200).json({ status: "ok" });
});

// Initialize MongoDB and Firebase
require("./config/mongodb");
require("./config/firebase");

app.use("/api/user", require("./routes/userRegistration"));

app.use("/api/auth", require("./routes/auth"));

app.use("/api/content", require("./routes/content"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Auth routes

// User registration routes
