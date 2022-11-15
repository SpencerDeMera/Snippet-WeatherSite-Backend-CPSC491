const express = require('express')
const router = express.Router()

router.get('/', async (req,res) => {
  try {
    const data = require('../data/np.json')
    const searchValue = req.query.search_value
    const results = data.filter((item) =>
      ((item.name).toLowerCase()).includes(searchValue.toLowerCase())
    )

    res.status(200).json(results)
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router