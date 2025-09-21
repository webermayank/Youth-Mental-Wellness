const path = require('path');
const fs = require('fs');
const { callGemini } = require('./geminiClient');
const { callPythonMl } = require('./pythonClient');

const { VERTEX_PROVIDER = 'mock' } = process.env;

const MOCK = {
    mood: 'stressed',
    affirmation: "You're doing your best. Take 3 slow breaths and try a 10-minute break.",
    playlist: ['https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO']
};

function loadLocalMappings() {
    try {
        const dataDir = path.resolve(__dirname, '..', '..', 'Gen-AI-powered-');
        const moodMapPath = path.join(dataDir, 'mood_to_affirmation_en.json');
        const moodsCsv = path.join(dataDir, 'moods.csv');
        const moodMap = fs.existsSync(moodMapPath) ? JSON.parse(fs.readFileSync(moodMapPath, 'utf8')) : {};
        const keywords = {};
        if (fs.existsSync(moodsCsv)) {
            const lines = fs.readFileSync(moodsCsv,'utf8').split(/\\r?\\n/).filter(Boolean);
            lines.forEach(l => {
                const parts = l.split(',');
                if (parts.length >= 2) {
                    const word = parts[0].trim().toLowerCase();
                    const label = parts[1].trim().toLowerCase();
                    keywords[word] = label;
                }
            });
        }
        return { moodMap, keywords };
    } catch (e) {
        return { moodMap: {}, keywords: {} };
    }
}

function keywordMatch(text, keywords) {
    const t = text.toLowerCase();
    for (const k of Object.keys(keywords)) {
        if (k.length>1 && t.includes(k)) return keywords[k];
    }
    if (t.match(/stress|stressed|anxiet|panic|overwhelm/)) return 'stressed';
    if (t.match(/sad|depress|lonely|gloom/)) return 'sad';
    if (t.match(/happy|great|good|excited/)) return 'happy';
    if (t.match(/lonely|alone/)) return 'lonely';
    return 'neutral';
}

async function inferMoodAndAffirmation(text) {
    if (!text) return { ...MOCK, confidence: 0.0 };

    if (VERTEX_PROVIDER === 'mock') {
        return { ...MOCK, confidence: 0.9 };
    }

    // if configured to use python service
    if (VERTEX_PROVIDER === 'python') {
        try {
            const res = await callPythonMl(text);
            // expected { mood, affirmation, playlist, safety_flag }
            return {
                mood: res.mood || 'neutral',
                affirmation: res.affirmation || MOCK.affirmation,
                playlist: [res.playlist].flat(),
                confidence: 0.9
            };
        } catch (e) {
            console.warn('python ml call failed', e.message);
            // fallback to mock
            return { ...MOCK, confidence: 0.1 };
        }
    }

    // default: attempt to call Gemini via callGemini (if implemented)
    try {
        const { moodMap, keywords } = loadLocalMappings();
        const mood = keywordMatch(text, keywords);
        let affirmation = (moodMap && moodMap[mood] && moodMap[mood][0]) ? moodMap[mood][0] : MOCK.affirmation;

        if (VERTEX_PROVIDER === 'gcp' || VERTEX_PROVIDER === 'gemini') {
            try {
                const prompt = `You are an empathetic youth support assistant. User says: "${text}". Respond with a single short empathetic affirmation (max 25 words) appropriate for mood '${mood}'. Do NOT give medical advice.`;
                const gResp = await callGemini(prompt, {maxTokens:80, temperature:0.25});
                if (gResp && gResp.text && gResp.text.trim().length>0) {
                    affirmation = gResp.text.trim();
                }
            } catch (e) {
                console.warn('Gemini call failed, using rule affirmation', e.message || e);
            }
        }

        const playlistMap = {
            stressed: ['https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO'],
            sad: ['https://open.spotify.com/playlist/37i9dQZF1DWY4xHQp97fN0'],
            happy: ['https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC'],
            neutral: ['https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd'],
            lonely: ['https://open.spotify.com/playlist/37i9dQZF1DX7gIoKXt0gmx']
        };

        return {
            mood,
            affirmation,
            playlist: playlistMap[mood] || playlistMap['neutral'],
            confidence: 0.85
        };
    } catch (e) {
        console.error('infer error', e);
        return { ...MOCK, confidence: 0.0 };
    }
}

module.exports = { inferMoodAndAffirmation };
