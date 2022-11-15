const url = require('url')
const express = require('express')
const router = express.Router()
const axios = require('axios')

// ENV vars
const BASE_URL = process.env.YELPEVENTS_URL
const TOKEN = process.env.YELPFUSION_KEY

router.get('/', async (req,res) => {
  try {
    const params = new URLSearchParams({
      ...url.parse(req.url, true).query
    })
    console.log(`${BASE_URL}?${params}`)
    const apiRes = await axios.get(`${BASE_URL}?${params}`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    })
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