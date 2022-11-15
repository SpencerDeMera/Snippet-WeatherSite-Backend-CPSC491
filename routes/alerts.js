const express = require('express')
const router = express.Router()
const axios = require('axios')

// ENV vars
const BASE_URL = process.env.NWS_URL

router.get('/', async (req,res) => {
  try {
    // Truncate to 4 decimal places
    const lat = (Math.round(req.query.lat * 10000) / 10000).toFixed(4)
    const lon = (Math.round(req.query.lon * 10000) / 10000).toFixed(4)
    const coords = `${lat},${lon}`

    const apiRes_url = await axios.get(`${BASE_URL}/points/${coords}`)
    const data_url = await apiRes_url.data.properties.county
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`REQUEST: ${BASE_URL}/points/${coords}`)
    }

    const apiRes_zone = await axios.get(data_url)
    const data_zone = await apiRes_zone.data.properties.id

    if (process.env.NODE_ENV !== 'production') {
      console.log(`REQUEST: ${data_url}`)
    }

    const params = new URLSearchParams({
      zone: data_zone,
      message_type: 'alert',
      severity: 'Extreme,Severe',
      urgency: 'Immediate,Expected,Future'
    })
    const apiRes_alert = await axios.get(`${BASE_URL}/alerts/active?${ params }`)
    const data_alert = apiRes_alert.data

    if (process.env.NODE_ENV !== 'production') {
      console.log(`REQUEST: ${BASE_URL}/alerts/active?${params}`)
    }

    res.status(200).json(data_alert)
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router