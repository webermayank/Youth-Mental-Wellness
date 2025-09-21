const express = require('express');
const router = express.Router();
const { saveCheckin } = require('../db/firestoreClient');

// feedback: store to 'feedback' collection in Firestore (or log if disabled)
router.post('/api/feedback', async (req,res) => {
    const { userId='demo_user', rating, notes } = req.body || {};
    try {
        // reuse saveCheckin to store feedback as a checkin with type 'feedback'
        await saveCheckin(userId, { type:'feedback', rating, notes });
        res.json({ ok:true });
    } catch (e) {
        res.status(500).json({ error:'save_failed' });
    }
});

module.exports = router;