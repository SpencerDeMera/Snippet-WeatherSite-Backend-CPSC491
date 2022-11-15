const url = require('url')
const express = require('express')
const router = express.Router()
const axios = require('axios')

// ENV vars
const BASE_URL = process.env.GOOGLEPLACE_URL
const API_KEY = process.env.GOOGLEPLACE_KEY

// Outputs a photo_reference given a textquery
router.get('/find_photo', async (req,res) => {
  try {
    const params_ref = new URLSearchParams({
      'key': API_KEY,
      'inputtype': 'textquery',
      'fields': 'name,photo',
      ...url.parse(req.url, true).query
    })
    const resp_ref = await axios.get(`${BASE_URL}/findplacefromtext/json?${params_ref}`)
    const data_ref = resp_ref.data['candidates']
    const photo_ref = data_ref[0].photos[0].photo_reference // use first photo ref

    if (process.env.NODE_ENV !== 'production') {
      console.log(`REQUEST: ${BASE_URL}/findplacefromtext/json?${params_ref}`)
    }

    if (!photo_ref) return null;

    const params_photo = new URLSearchParams({
      'key': API_KEY,
      'photo_reference': photo_ref,
      'maxheight': 300
    })
    const resp_photo = await axios.get(`${BASE_URL}/photo?${params_photo}`)
    const result = ['https://', resp_photo.request.socket._host, resp_photo.request.path].join('')

    if (process.env.NODE_ENV !== 'production') {
      console.log(`REQUEST: ${BASE_URL}/photo?${params_photo}`)
    }

    res.status(200).json(result)
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router