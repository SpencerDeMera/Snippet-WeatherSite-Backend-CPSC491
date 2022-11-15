const url = require('url')
const express = require('express')
const router = express.Router()
const axios = require('axios')

// ENV vars
const BASE_URL = process.env.GEOAPIFY_URL
const API_KEY = process.env.GEOAPIFY_KEY

router.get('/', async (req,res) => {
  try {
    const params = new URLSearchParams({
      'apiKey': API_KEY,
      ...url.parse(req.url, true).query
    })
    const apiRes = await axios.get(`${BASE_URL}?${params}`)
    const data = apiRes.data

    if (process.env.NODE_ENV !== 'production') {
      console.log(`REQUEST: ${BASE_URL}?${params}`)
    }

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router