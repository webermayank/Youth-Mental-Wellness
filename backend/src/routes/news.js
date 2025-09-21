const express = require('express');
const router = express.Router();
const { getNews } = require('../services/newsClient');

router.get('/api/news', async (req, res) => {
     try {
       const items = await getNews();
       res.json({ items });
     } catch (e) {
       console.error(e);
       res.status(500).json({ error: "Failed to fetch news" });
     }
});

module.exports = router;
