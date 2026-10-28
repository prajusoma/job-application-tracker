import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import applicationsRouter from "./routes/applications.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
  ],
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/applications", applicationsRouter);

app.use((error, _req, res, _next) => {
  console.error(error);
  const status = error.name === "ValidationError" ? 400 :
    error.name === "CastError" ? 400 : 500;
  res.status(status).json({ message: error.message || "Server error" });
});

const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/job_tracker")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => console.log(`API running on http://localhost:${port}`));
  })
  .catch(error => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
