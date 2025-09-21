const express = require('express');
const router = express.Router();
const { redactPII } = require('../utils/redact');
const { inferMoodAndAffirmation } = require('../services/vertexcClient');
const { saveCheckin } = require('../db/firestoreClient');

router.post('/api/summarize', async (req, res) => {
    try {
        const { userId = 'demo_user', text, mode = 'affirmation' } = req.body || {};
        if (!text) return res.status(400).json({ error: 'text required' });

        const clean = redactPII(text);
        const aiRes = await inferMoodAndAffirmation(clean);

        const out = {
            mood: aiRes.mood,
            affirmation: aiRes.affirmation,
            playlist: aiRes.playlist || [],
            weather_suggestion: aiRes.weather_suggestion || null,
            timestamp: new Date().toISOString()
        };

        // save checkin (no-op unless FIRESTORE_ENABLED=true)
        await saveCheckin(userId, { text: clean, ...out });

        return res.json(out);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'internal_error' });
    }
});

module.exports = router;
