const emailRe = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const phoneRe = /\+?\d[\d\- ()]{7,}\d/g;

function redactPII(text = '') {
    return text.replace(emailRe, '[REDACTED_EMAIL]').replace(phoneRe, '[REDACTED_PHONE]').trim();
}

module.exports = { redactPII };
