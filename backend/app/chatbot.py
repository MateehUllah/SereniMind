from fastapi import APIRouter, UploadFile, File, Depends,Body
import shutil
import os
import ollama
from app.mood_crisis_data import CRISIS_WORDS
from app.speech import speech_to_text, text_to_speech
from app.chat_history import store_chat, get_chat_history
from app.auth import get_current_user

router = APIRouter()

system_prompt = """
You are an empathetic mental health chatbot. Your role is to listen, support, and provide self-help strategies.
You do NOT provide medical advice. If a user is in crisis, encourage them to seek professional help.
"""

def get_chat_response(user_message, max_tokens=1000, temperature=0.7):
    messages = [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_message}]
    print("before olama calling")

    response = ollama.chat(model="deepseek-r1", messages=messages, options={"max_tokens": max_tokens, "temperature": temperature})
    print("after olama calling",response)
    return response["message"]["content"]

@router.post("/")
async def chat(user_message: str = Body(..., embed=True), 
    response_format: str = Body("text", embed=True), 
user_id: int = Depends(get_current_user)):
    if any(word in user_message.lower() for word in CRISIS_WORDS):
        return {"response": "Please seek professional help. You're not alone ❤️."}

    response_text = get_chat_response(user_message)
    store_chat(user_id, user_message, response_text, None)

    if response_format == "voice":
        audio_file = text_to_speech(response_text)
        return {"response": response_text, "audio_file": audio_file}

    return {"response": response_text}

@router.get("/history")
async def chat_history(limit: int = 10, user_id: int = Depends(get_current_user)):
    history = get_chat_history(user_id, limit)
    return {"history": [{"user_message": h[0], "bot_response": h[1], "mood": h[2], "timestamp": h[3]} for h in history]}

@router.post("/voice")
async def chat_with_voice(file: UploadFile = File(...), user_id: int = Depends(get_current_user)):
    file_location = f"temp_audio_{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    text_result = speech_to_text(file_location)
    if "error" in text_result:
        return text_result
    user_message = text_result["text"]
    response_text = get_chat_response(user_message)
    audio_file = text_to_speech(response_text)
    os.remove(file_location)
    return {"response": response_text, "audio_file": audio_file}
