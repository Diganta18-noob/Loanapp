const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

// Middleware - CORS configuration for web and mobile (supports environment variables)
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : [
      "http://localhost:5173",
      "http://192.168.29.207:5173",
      "http://192.168.29.207:5000",
    ];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve static files from the compiled React client app
app.use(express.static(path.join(__dirname, "../client/dist")));

// Routes
const userRouter = require("./routes/userRouter");
const loanRouter = require("./routes/loanRouter");
const loanApplicationRouter = require("./routes/loanApplicationRouter");
const auditLogRouter = require("./routes/auditLogRouter");
const chatbotRouter = require("./routes/chatbotRouter");

app.use("/user", userRouter);
app.use("/loan", loanRouter);
app.use("/loanApplication", loanApplicationRouter);
app.use("/auditLog", auditLogRouter);
app.use("/chatbot", chatbotRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "UP", message: "VehicleLoanHub API is running..." });
});

// Wildcard route to redirect all other requests to React Router (SPA)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/vehicle_loan_hub";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });
