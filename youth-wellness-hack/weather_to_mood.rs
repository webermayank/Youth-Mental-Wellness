// Weather-to-Mood Rules for a Weather App or News Channel

pub fn get_mood_tip(weather: &str, temp_c: Option<f32>) -> &'static str {
    match (weather, temp_c) {
        ("rainy", Some(temp)) if temp < 15.0 => "Try indoor breathing + a warm drink.",
        ("rainy", _) => "Listen to calming music indoors.",
        ("sunny", _) => "10-min walk to lift your mood.",
        ("cloudy", _) => "Read a favorite book or call a friend.",
        ("cold", _) => "Stretch gently for 5 minutes.",
        ("hot", Some(temp)) if temp > 30.0 => "Drink water and rest in shade.",
        ("hot", _) => "Wear light clothes and stay hydrated.",
        ("stormy", _) => "Practice deep breathing and stay safe indoors.",
        ("windy", _) => "Enjoy indoor hobbies or games.",
        ("foggy", _) => "Mindful meditation for clarity.",
        ("humid", _) => "Take cool showers and drink fluids.",
        ("snowy", _) => "Warm up with gentle yoga indoors.",
        ("hail", _) => "Stay inside and listen to relaxing sounds.",
        ("thunderstorm", _) => "Stay safe, read or journal.",
        ("drizzle", _) => "Light stretching at home.",
        ("clear", _) => "Step outside for a fresh air break.",
        ("overcast", _) => "Try a creative activity indoors.",
        ("blizzard", _) => "Bundle up and watch a comforting movie.",
        ("sleet", _) => "Enjoy a hot beverage and relax.",
        _ => "Check in with yourself and do something comforting."
    }
}