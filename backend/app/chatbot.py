from fastapi import APIRouter, UploadFile, File, Depends,Body
import shutil
import os
import ollama
from app.mood_crisis_data import CRISIS_WORDS
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

    return {"response": response_text}

@router.get("/history")
async def chat_history(limit: int = 10, user_id: int = Depends(get_current_user)):
    history = get_chat_history(user_id, limit)
    return {"history": [{"user_message": h[0], "bot_response": h[1], "mood": h[2], "timestamp": h[3]} for h in history]}

