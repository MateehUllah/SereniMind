from app.database import cursor, conn

def store_chat(user_id, user_message, bot_response, mood):
    cursor.execute("""
        INSERT INTO chats (user_id, user_message, bot_response, mood) 
        VALUES (?, ?, ?, ?)
    """, (user_id, user_message, bot_response, mood))
    conn.commit()

def get_chat_history(user_id, limit=10):
    cursor.execute("""
        SELECT user_message, bot_response, mood, timestamp 
        FROM chats WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?
    """, (user_id, limit))
    return cursor.fetchall()