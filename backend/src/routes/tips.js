const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const dataDir = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "youth-wellness-hack"
);

let tips = [];
try {
    const p = path.join(dataDir, 'health_tips.json');
    if (fs.existsSync(p)) tips = JSON.parse(fs.readFileSync(p,'utf8'));
    else {
        // fallback to CSV
        const csvp = path.join(dataDir, 'health_tips.csv');
        if (fs.existsSync(csvp)) {
            const txt = fs.readFileSync(csvp,'utf8').split(/\r?\n/).filter(Boolean);
            tips = txt.map((line,i)=>({id:i+1, text: line}));
        }
    }
} catch(e) {
    tips = [{id:1,text:"Take a quick 5-minute walk."}];
}

router.get('/api/dailytip', (req,res) => {
    const { mood } = req.query;
    if (!mood) {
        const t = tips[Math.floor(Math.random()*tips.length)];
        return res.json({ tip: t });
    }
    // simple mood -> tip mapping: pick first that includes mood word else random
    const found = tips.find(t => (t.text||'').toLowerCase().includes(mood.toLowerCase()));
    res.json({ tip: found || tips[Math.floor(Math.random()*tips.length)] });
});

module.exports = router;