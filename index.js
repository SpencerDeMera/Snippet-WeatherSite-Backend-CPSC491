const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 4000;

const app = express();

const whitelist = [
  "http://127.0.0.1",
  "http://127.0.0.1:5500",
  "http://localhost:3000",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const limiter = rateLimit({
  windowMs: 1000 * 60 * 10,
  max: 100,
});

app.use(limiter);
app.set("trust proxy", 1);

// Routes
app.get("/", (req, res) => res.json({ success: "Hello world!" }));
app.use("/geo", require("./routes/geo.js"));
app.use("/georev", require("./routes/georev.js"));
app.use("/weather", require("./routes/weather.js"));
app.use("/airquality", require("./routes/airquality.js"));
app.use("/places", require("./routes/places.js"));
app.use("/events", require("./routes/events.js"));
app.use("/alerts", require("./routes/alerts.js"));
app.use("/parklist", require("./routes/parklist.js"));
app.use("/nps", require("./routes/nps.js"));
app.use("/google", require("./routes/google.js"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
