import vertexai
from vertexai.generative_models import GenerativeModel

def test_vertex():
    try:
        # Initialize with your project + region
        vertexai.init(project="healthmoodapp", location="asia-south1")

        # Load a Gemini model hosted on Vertex
        model = GenerativeModel("gemini-1.5-flash")

        # Make a small test request
        response = model.generate_content("Say hello in one short sentence.")

        print("✅ Vertex AI Test Success!")
        print("Response:", response.text)

    except Exception as e:
        print("❌ Vertex AI Test Failed")
        print("Error:", e)

if __name__ == "__main__":
    test_vertex()
