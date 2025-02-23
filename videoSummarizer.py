import openai
import whisper
import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from the .env file
load_dotenv()

# Function to transcribe video using Whisper
def transcribe_video(video_path):
    model = whisper.load_model("base")  # Load Whisper model
    result = model.transcribe(video_path)  # Transcribe the video
    return result['text']  # Return transcribed text

async def summarize_text(text):
    openai_api_key = os.getenv("OPENAI_API_KEY")  # Fetch the OpenAI API key
    if not openai_api_key:
        raise ValueError("OpenAI API key is not set.")

    # Set the OpenAI API key for use
    openai.api_key = openai_api_key

    # Prepare the prompt for summarization
    prompt = f"""Provide a detailed summary of the following text, highlighting 
the startup's mission, target audience, core product or service, 
market differentiation, business model, growth strategy, and key achievements: {text}"""

    client = OpenAI()  # Instantiate the OpenAI client

    # Use the ChatCompletion API with async client
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",  # Or "gpt-4" if you prefer
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=250
    )

    # Use model_dump_json() to get the response in dictionary format
    return response.model_dump_json(indent=2)

async def main():
    video_path = "./videoplayback.mp4"  # Your video file path
    transcription = transcribe_video(video_path)  # Transcribe the video

    # Get the summarized text
    summarized_text = await summarize_text(transcription)
    print("\nSummarized Text:\n", summarized_text)

# If using asyncio, make sure to run the main function asynchronously
if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
