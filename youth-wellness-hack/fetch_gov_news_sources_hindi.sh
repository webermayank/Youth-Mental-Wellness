#!/bin/bash

# सरकारी समाचार स्रोत (Government News Sources in Hindi)

# --- PIB RSS फीड ---
# PIB (प्रेस सूचना ब्यूरो) के RSS लिंक के लिए placeholders
PIB_RSS1="https://www.bing.com/ck/a?!&&p=789ab02a32d654af533ecbbddd0dcd338429dcb3bae48867b9bde4357d883c99JmltdHM9MTc1NjY4NDgwMA&ptn=3&ver=2&hsh=4&fclid=08baff12-3534-6674-379f-e930343267ce&psq=PIB+RSS&u=a1aHR0cHM6Ly93d3cucGliLmdvdi5pbi9WaWV3UnNzLmFzcHg"
PIB_RSS2="https://www.bing.com/ck/a?!&&p=588bca47127e09b5a069467e04f83b4d6c5536d4d584782f253a97c8dc087259JmltdHM9MTc1NjY4NDgwMA&ptn=3&ver=2&hsh=4&fclid=08baff12-3534-6674-379f-e930343267ce&psq=PIB+RSS&u=a1aHR0cHM6Ly93d3cubW9zcGkuZ292LmluL3ByZXNzLWluZm9ybWF0aW9uLWJ1cmVhdQ"

echo "PIB RSS फीड प्राप्त की जा रही है..."
curl -s "$PIB_RSS1" -o pib_rss1.xml
curl -s "$PIB_RSS2" -o pib_rss2.xml

# --- NewsAPI ---
NEWSAPI_ENDPOINT="https://newsapi.org/v2/top-headlines?country=in"
NEWSAPI_KEY="6aa22ab8e7de44208fb1eb8b2ce356e2"

echo "NewsAPI से भारत की प्रमुख खबरें प्राप्त की जा रही हैं..."
curl -s -H "Authorization: $NEWSAPI_KEY" "$NEWSAPI_ENDPOINT" -o newsapi_top_headlines.json

# --- स्थानीय हेल्पलाइन ---
LOCAL_HELPLINES_CSV="important_emergency_numbers_Version1.csv"

echo "स्थानीय हेल्पलाइन नंबर दिखाए जा रहे हैं ($LOCAL_HELPLINES_CSV)..."
if [ -f "$LOCAL_HELPLINES_CSV" ]; then
    column -t -s, "$LOCAL_HELPLINES_CSV" | less
else
    echo "CSV फाइल $LOCAL_HELPLINES_CSV नहीं मिली!"
fi

echo "कार्य पूर्ण हुआ।"