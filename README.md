# SereniMind – Your AI Companion for Calm, Clarity, and Support

## Overview
SereniMind is an AI-powered mental health chatbot designed to provide empathetic, context-aware conversations for users seeking emotional support. Unlike traditional chatbots, it maintains **conversation continuity**, allowing users to **resume past discussions seamlessly**, ensuring a **human-like and personalized experience**.

## Features
- 🧠 **Context-Aware AI** – Remembers conversation history for meaningful interactions.
- 🔒 **Secure & Private** – User authentication ensures data privacy.
- ⚡ **Fast & Scalable** – Optimized API response times with React-based frontend.
- 🔄 **Seamless Conversations** – Users can continue past chats without repetition.
- 🔧 **Future-Ready** – Can be extended to include voice, multilingual, and sentiment tracking.

## Tech Stack
- **Frontend:** React, Zustand (state management), React Query (API calls)
- **Backend:** FastAPI (Python), SQLite (database)
- **AI Model:** Deepseek-r1 (via Ollama)
- **Authentication:** Secure user-based access

## Installation & Setup

### Ollama Setup for Deepseek-r1
To use Deepseek-r1 with Ollama, install Ollama and the Deepseek-r1 model:
```bash
curl -fsSL https://ollama.ai/install.sh | sh

ollama pull deepseek-r1
```

Run the Ollama server:
```bash
ollama run deepseek-r1
```
Ensure the server is running before using the chatbot.

### Prerequisites
- Python 3.9+
- Node.js 16+
- SQLite
- FastAPI & React dependencies

### Backend Setup
```bash
git clone https://github.com/MateehUllah/SereniMind.git

cd SereniMind/backend

python3 -m venv venv
source venv/bin/activate  

pip install -r requirements.txt

uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend Setup
```bash
cd ../frontend

npm install

set .env file

npm run dev
```

## Future Enhancements 🚀
- **🗣️ Voice & Multimodal Support** – Expanding interactions beyond text.
- **🌍 Multilingual AI** – Support for multiple languages.
- **🎭 Sentiment Analysis** – Personalized response based on mood.
- **🤝 Therapist Integration** – Connect users with professional help.

## Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature-branch`).
3. Commit changes and push (`git push origin feature-branch`).
4. Submit a pull request.

## License
This project is licensed under the MIT License. See `LICENSE` for details.

## Contact
For any queries or collaboration opportunities, reach out to **mateehullah89@email.com**.

