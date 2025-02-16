import speech_recognition as sr
from gtts import gTTS
import os
import uuid

def speech_to_text(audio_file):
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_file) as source:
        audio = recognizer.record(source)
        return {"text": recognizer.recognize_google(audio)}

def text_to_speech(text):
    filename = f"response_{uuid.uuid4().hex}.mp3"
    tts = gTTS(text=text, lang="en")
    tts.save(filename)
    return filename