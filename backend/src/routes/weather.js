const express = require('express');
const router = express.Router();
const { getWeather } = require('../services/weatherClient');

router.get('/api/weather', async (req, res) => {
    const { zip } = req.query;
    const w = await getWeather(zip);
    res.json(w);
});

module.exports = router;
