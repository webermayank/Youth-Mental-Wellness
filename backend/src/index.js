require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { PORT = 8000, FRONTEND_ORIGIN } = process.env;
const healthRouter = require("./routes/healthroutes");
// const aiRouter = require('./routes/ai');
const weatherRouter = require("./routes/weather");
const newsRouter = require("./routes/news");
const flashRouter = require("./routes/flashcard");
const tipsRouter = require("./routes/tips");
const feedbackRouter = require("./routes/feedback");
const trendsRouter = require("./routes/trends");
const summarizeRoutes = require("./routes/summarize");
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
    origin: [
      FRONTEND_ORIGIN || "http://localhost:5173",
      "http://localhost:5175",
      "http://localhost:4000",
    ],
    credentials: true,
  })
);

app.use("/", healthRouter);
// app.use('/', aiRouter);
app.use("/", summarizeRoutes);
app.use("/", weatherRouter);
app.use("/", newsRouter);
app.use("/", flashRouter);
app.use("/", tipsRouter);
app.use("/", feedbackRouter);
app.use("/", trendsRouter);
app.use("/", checkinRouter);

app.get("/", (req, res) => res.send("Server is UP — Express backend running"));

app.listen(PORT, () => {
  console.log(`Backend listening on ${PORT} (ENV=${process.env.ENV})`);
});
