require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { PORT = 8000, FRONTEND_ORIGIN } = process.env;
const healthRouter = require("./routes/healthroutes");
const aiRouter = require("./routes/ai");
const weatherRouter = require("./routes/weather");
const newsRouter = require("./routes/news");
const flashRouter = require("./routes/flashcard");
const tipsRouter = require("./routes/tips");
const feedbackRouter = require("./routes/feedback");
const trendsRouter = require("./routes/trends");
// const summarizeRoutes = require("./routes/summarize"); // Removed - using ML service
const checkinRouter = require("./routes/checkin");

const app = express();

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://buttons.github.io"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      styleSrcElem: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
      ],
      styleSrcAttr: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
      ],
      fontSrc: [
        "'self'",
        "data:",
        "https://fonts.gstatic.com",
        "https://mkvrpjt.syncpadai.xyz/",
      ],
      imgSrc: ["'self'", "data:"],
      mediaSrc: ["'self'", "data:"],
      workerSrc: ["'self'", "blob:"],
      connectSrc: ["'self'"],
      frameSrc: ["'self'"],
    },
  })
);
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;"
  );
  next();
});

app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("CORS request from origin:", origin);

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5175",
        "http://localhost:4000",
        "https://youth-mental-wellness.vercel.app",
        "https://askai-health-frontend.vercel.app",
        "https://askai-health.vercel.app",
      ];

      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        console.log("CORS: Origin allowed:", origin);
        return callback(null, true);
      }

      // Check if it's a Vercel preview URL
      if (origin.includes(".vercel.app")) {
        console.log("CORS: Vercel preview URL allowed:", origin);
        return callback(null, true);
      }

      console.log("CORS: Origin blocked:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use("/", healthRouter);
app.use("/", aiRouter);
// app.use("/", summarizeRoutes); // Removed - now using ML service in ai.js
app.use("/", weatherRouter);
app.use("/", newsRouter);
app.use("/", flashRouter);
app.use("/", tipsRouter);
app.use("/", feedbackRouter);
app.use("/", trendsRouter);
app.use("/", checkinRouter);

app.get("/", (req, res) => res.send("Server is UP — Express backend running"));

// Start the server
app.listen(PORT, () => {
  console.log(`Backend listening on ${PORT} (ENV=${process.env.ENV})`);
});
