// Minimal Gemini/Vertex AI wrapper - supports 'mock' and a sample REST call method placeholder.
// For production you should replace callGemini() with a proper Google Cloud Vertex AI SDK call
const { VERTEX_PROVIDER = 'mock' } = process.env;

async function callGemini(prompt, opts = {}) {
    if (VERTEX_PROVIDER === 'mock') {
        // simple canned response generation (echo style)
        const sample = "I hear you — that sounds difficult. Take a slow breath and remember you're not alone.";
        return { text: sample, raw: null };
    }
    // If VERTEX_PROVIDER !== mock, attempt to use Google Vertex AI via REST (requires service account)
    // This is a placeholder. Users must implement their own Vertex AI integration using official SDK.
    throw new Error('Gemini/Vertex AI integration not implemented in this environment. Set VERTEX_PROVIDER=mock for local dev.');
}

module.exports = { callGemini };