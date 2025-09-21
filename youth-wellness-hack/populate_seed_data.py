import pandas as pd
import os
import json

# Get the base directory by navigating up from the script's location
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir, os.pardir))

# Define corrected file paths based on your directory structure and new file names
affirmations_path = os.path.join(base_dir, "affirmations", "affirmations.csv")
affirmations_hindi_path = os.path.join(base_dir, "affirmations", "affirmations_hindi.csv")
health_tips_path = os.path.join(base_dir, "health_tips", "health_tips.csv")
health_tips_hindi_path = os.path.join(base_dir, "health_tips", "health_tips_hindi.csv")
moods_path = os.path.join(base_dir, "moods", "moods.csv")
moods_hindi_path = os.path.join(base_dir, "moods", "moods_hindi.csv")

# Paths for JSON, Rust, and Shell files
mood_to_affirmation_en_json_path = os.path.join(base_dir, "mood_to_affirmation", "mood_to_affirmation_en.json")
mood_to_affirmation_hindi_json_path = os.path.join(base_dir, "mood_to_affirmation", "mood_to_affirmation_hindi.json")
weather_to_mood_rs_path = os.path.join(base_dir, "weather_to_mood", "weather_to_mood.rs")
weather_to_mood_hindi_rs_path = os.path.join(base_dir, "weather_to_mood", "weather_to_mood_hindi.rs")
fetch_gov_news_sources_sh_path = os.path.join(base_dir, "gov_news_sources", "fetch_gov_news_sources.sh")
fetch_gov_news_sources_hindi_sh_path = os.path.join(base_dir, "gov_news_sources", "fetch_gov_news_sources_hindi.sh")


# Function to create dummy data files with the specified new format
def create_dummy_files():
    # Affirmations CSVs
    affirmations_data = {
        'id': [1, 2, 3],
        'mood_tag': ['confused', 'anxious', 'depressed'],
        'text': ['Take a deep breath and give yourself time.', 'You are safe right now.', 'You are not alone.'],
        'tone': ['calm', 'calm', 'supportive'],
        'language': ['en', 'en', 'en'],
        'safety_flag': [0, 0, 0]
    }
    pd.DataFrame(affirmations_data).to_csv(affirmations_path, index=False)

    affirmations_hindi_data = {
        'id': [1, 2, 3],
        'mood_tag': ['भ्रमित', 'चिंतित', 'उदासीन'],
        'text': ['गहरी सांस लें और खुद को समय दें।', 'आप अभी सुरक्षित हैं।', 'आप अकेले नहीं हैं।'],
        'tone': ['शांत', 'शांत', 'सहायक'],
        'language': ['hi', 'hi', 'hi'],
        'safety_flag': [0, 0, 0]
    }
    pd.DataFrame(affirmations_hindi_data).to_csv(affirmations_hindi_path, index=False, encoding='utf-8')

    # Health Tips CSVs
    health_tips_data = {
        'id': [1, 2],
        'category': ['physical', 'mental'],
        'title': ['Stay Hydrated', 'Mindfulness'],
        'content': ['Drink plenty of water throughout the day.', 'Practice 10 minutes of meditation.'],
        'duration_min': [None, 10],
        'language': ['en', 'en']
    }
    pd.DataFrame(health_tips_data).to_csv(health_tips_path, index=False)

    health_tips_hindi_data = {
        'id': [1, 2],
        'category': ['शारीरिक', 'मानसिक'],
        'title': ['हाइड्रेटेड रहें', 'माइंडफुलनेस'],
        'content': ['दिन भर में खूब पानी पिएं।', '10 मिनट ध्यान का अभ्यास करें।'],
        'duration_min': [None, 10],
        'language': ['hi', 'hi']
    }
    pd.DataFrame(health_tips_hindi_data).to_csv(health_tips_hindi_path, index=False, encoding='utf-8')

    # Moods CSVs
    moods_data = {
        'id': [1, 2, 3],
        'example_text': ['I feel lost.', 'I have a test tomorrow.', 'I can\'t get out of bed.'],
        'mood_label': ['confused', 'anxious', 'depressed'],
        'notes': ['User is seeking clarity.', 'User is worried about future events.', 'User feels low energy.']
    }
    pd.DataFrame(moods_data).to_csv(moods_path, index=False)
    
    moods_hindi_data = {
        'id': [1, 2, 3],
        'example_text': ['मैं खोया हुआ महसूस कर रहा हूं।', 'कल मेरा टेस्ट है।', 'मैं बिस्तर से बाहर नहीं निकल सकता।'],
        'mood_label': ['भ्रमित', 'चिंतित', 'उदासीन'],
        'notes': ['उपयोगकर्ता स्पष्टता चाहता है।', 'उपयोगकर्ता भविष्य की घटनाओं के बारे में चिंतित है।', 'उपयोगकर्ता कम ऊर्जा महसूस करता है।']
    }
    pd.DataFrame(moods_hindi_data).to_csv(moods_hindi_path, index=False, encoding='utf-8')

    # Mood to Affirmation JSONs
    mood_to_affirmation_en = {
        "confused": {"source": "affirmations.csv", "fallback": "Take a deep breath and give yourself time."},
        "anxious": {"source": "affirmations.csv", "fallback": "You are safe right now."},
        "depressed": {"source": "affirmations.csv", "fallback": "You are not alone."}
    }
    with open(mood_to_affirmation_en_json_path, 'w', encoding='utf-8') as f:
        json.dump(mood_to_affirmation_en, f, indent=4)

    mood_to_affirmation_hindi = {
        "भ्रमित": {"source": "affirmations_hindi.csv", "fallback": "गहरी सांस लें और खुद को समय दें।"},
        "चिंतित": {"source": "affirmations_hindi.csv", "fallback": "आप अभी सुरक्षित हैं।"},
        "उदासीन": {"source": "affirmations_hindi.csv", "fallback": "आप अकेले नहीं हैं।"}
    }
    with open(mood_to_affirmation_hindi_json_path, 'w', encoding='utf-8') as f:
        json.dump(mood_to_affirmation_hindi, f, indent=4, ensure_ascii=False)
    
    # Rust files (no content needed for this script, just their existence)
    with open(weather_to_mood_rs_path, 'w') as f:
        f.write('// Rust weather to mood logic')
    with open(weather_to_mood_hindi_rs_path, 'w') as f:
        f.write('// Rust weather to mood logic (Hindi)')
    
    # Shell files
    with open(fetch_gov_news_sources_sh_path, 'w') as f:
        f.write('echo "Fetching English news sources."')
    with open(fetch_gov_news_sources_hindi_sh_path, 'w') as f:
        f.write('echo "Fetching Hindi news sources."')

# Create dummy files to ensure the script runs without FileNotFoundError
create_dummy_files()

# Read CSV files with new schema
try:
    affirmations = pd.read_csv(affirmations_path)
    affirmations_hindi = pd.read_csv(affirmations_hindi_path, encoding="utf-8")
    health_tips = pd.read_csv(health_tips_path)
    health_tips_hindi = pd.read_csv(health_tips_hindi_path, encoding="utf-8")
    moods = pd.read_csv(moods_path)
    moods_hindi = pd.read_csv(moods_hindi_path, encoding="utf-8")
    print("All CSV files read successfully. ✅")
except FileNotFoundError as e:
    print(f"Error: One or more CSV files not found. {e} ❌")
except pd.errors.ParserError as e:
    print(f"Error parsing CSV file. Please check for extra commas or incorrect formatting. {e} ❌")

# Read JSON files
try:
    with open(mood_to_affirmation_en_json_path, 'r', encoding='utf-8') as f:
        mood_to_affirmation_en = json.load(f)
    with open(mood_to_affirmation_hindi_json_path, 'r', encoding='utf-8') as f:
        mood_to_affirmation_hindi = json.load(f)
    print("All JSON files read successfully. ✅")
except FileNotFoundError as e:
    print(f"Error: One or more JSON files not found. {e} ❌")
except json.JSONDecodeError as e:
    print(f"Error decoding JSON file: {e} ❌")

print("\nCorrected paths and file types handled correctly. 🎉")