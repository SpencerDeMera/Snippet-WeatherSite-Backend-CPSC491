const url = require("url");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const apicache = require("apicache");

// ENV vars
const BASE_URL = process.env.NPS_URL;
const API_KEY = process.env.NPS_KEY;

let cache = apicache.middleware;

router.get("/todo", cache("10 minutes"), async (req, res) => {
  try {
    const params = new URLSearchParams({
      api_key: API_KEY,
      ...url.parse(req.url, true).query,
    });
    const apiRes = await axios.get(`${BASE_URL}/thingstodo?${params}`);
    const data = apiRes.data;

    if (process.env.NODE_ENV !== "production") {
      console.log(`REQUEST: ${BASE_URL}/thingstodo?${params}`);
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
