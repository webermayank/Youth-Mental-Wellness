#!/bin/bash

# Government and News Sources

# --- PIB RSS Feeds ---
# Placeholder links for PIB RSS (Press Information Bureau)
PIB_RSS1="https://www.bing.com/ck/a?!&&p=789ab02a32d654af533ecbbddd0dcd338429dcb3bae48867b9bde4357d883c99JmltdHM9MTc1NjY4NDgwMA&ptn=3&ver=2&hsh=4&fclid=08baff12-3534-6674-379f-e930343267ce&psq=PIB+RSS&u=a1aHR0cHM6Ly93d3cucGliLmdvdi5pbi9WaWV3UnNzLmFzcHg"
PIB_RSS2="https://www.bing.com/ck/a?!&&p=588bca47127e09b5a069467e04f83b4d6c5536d4d584782f253a97c8dc087259JmltdHM9MTc1NjY4NDgwMA&ptn=3&ver=2&hsh=4&fclid=08baff12-3534-6674-379f-e930343267ce&psq=PIB+RSS&u=a1aHR0cHM6Ly93d3cubW9zcGkuZ292LmluL3ByZXNzLWluZm9ybWF0aW9uLWJ1cmVhdQ"

# Curl the PIB RSS feeds
echo "Fetching PIB RSS Feeds..."
curl -s "$PIB_RSS1" -o pib_rss1.xml
curl -s "$PIB_RSS2" -o pib_rss2.xml

# --- NewsAPI ---
# API endpoint and key
NEWSAPI_ENDPOINT="https://newsapi.org/v2/top-headlines?country=in"
NEWSAPI_KEY="6aa22ab8e7de44208fb1eb8b2ce356e2"

echo "Fetching NewsAPI top headlines (India)..."
curl -s -H "Authorization: $NEWSAPI_KEY" "$NEWSAPI_ENDPOINT" -o newsapi_top_headlines.json

# --- Local Helplines ---
# CSV file containing emergency numbers (sent to you as important_emergency_numbers_Version1.csv)
LOCAL_HELPLINES_CSV="important_emergency_numbers_Version1.csv"

echo "Displaying Local Helplines from $LOCAL_HELPLINES_CSV..."
if [ -f "$LOCAL_HELPLINES_CSV" ]; then
    column -t -s, "$LOCAL_HELPLINES_CSV" | less
else
    echo "CSV file $LOCAL_HELPLINES_CSV not found!"
fi

echo "Done."
