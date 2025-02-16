from fastapi import APIRouter, Body, Depends
from uuid import uuid4
import ollama
from app.mood_crisis_data import CRISIS_WORDS
from app.chat_history import store_chat, get_chat_history, create_new_conversation
from app.auth import get_current_user

router = APIRouter()

system_prompt = """
You are an empathetic mental health chatbot. Your role is to listen, support, and provide self-help strategies. 
You do NOT provide medical advice. If a user is in crisis, encourage them to seek professional help. Moreover, don't return your thinking part just return response.
"""

def get_chat_response(user_message, max_tokens=1000, temperature=0.7):
    print("Before I am here")
    messages = [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_message}]
    response = ollama.chat(model="deepseek-r1", messages=messages, options={"max_tokens": max_tokens, "temperature": temperature})
    print("After I am here",response)

    return response["message"]["content"]

@router.post("/")
async def chat(
    user_message: str = Body(..., embed=True),
    conversation_id: str = Body(None, embed=True),
    user_id: int = Depends(get_current_user)
):
    if any(word in user_message.lower() for word in CRISIS_WORDS):
        return {"response": "Please seek professional help. You're not alone ❤️."}

    if not conversation_id:
        conversation_id = str(uuid4())
        create_new_conversation(user_id, conversation_id)

    response_text = get_chat_response(user_message)
    store_chat(user_id, conversation_id, user_message, response_text, None)

    return {"response": response_text, "conversation_id": conversation_id}

@router.get("/history")
async def chat_history(limit: int = 10, user_id: int = Depends(get_current_user)):
    history = get_chat_history(user_id, limit)
    conversations = {}
    for row in history:
        conversation_id, user_message, bot_response, mood, timestamp = row
        if conversation_id not in conversations:
            conversations[conversation_id] = {
                "id": conversation_id,
                "messages": [],
                "timestamp": timestamp,
            }
        conversations[conversation_id]["messages"].append({
            "id": str(uuid4()),
            "user_message": user_message,
            "bot_response": bot_response,
            "mood": mood,
            "timestamp": timestamp,
        })
    return {"history": list(conversations.values())}