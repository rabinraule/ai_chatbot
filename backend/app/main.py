from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    personality: str = "friendly"


PERSONALITIES = {
    "friendly": (
        "You are a friendly AI chatbot. "
        "Be warm, casual, supportive, and conversational."
    ),
    "formal": (
        "You are a formal AI assistant. "
        "Respond professionally and clearly."
    ),
    "humorous": (
        "You are a funny AI chatbot. "
        "Add light humor and playful responses."
    ),
}


@app.get("/")
def home():
    return {
        "message": "AI Chatbot Backend Running with Ollama",
    }


@app.get("/chat")
def chat_help():
    return {
        "message": (
            "Use POST /chat with JSON body: "
            '{"message": "hi", "personality": "friendly"}'
        ),
    }


@app.post("/chat")
def chat(request: ChatRequest):
    message = request.message.strip()

    if not message:
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty.",
        )

    system_prompt = PERSONALITIES.get(
        request.personality.lower(),
        PERSONALITIES["friendly"],
    )

    full_prompt = f"""
You are an AI chatbot.
RULES:
- Stay on topic
- Keep responses conversational
- Do not generate long essays unless asked
- Respond naturally like ChatGPT
- Use the selected personality style

PERSONALITY:
{system_prompt}

USER MESSAGE:
{message}

ASSISTANT RESPONSE:
"""

    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3.2:3b",
                "prompt": full_prompt,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "top_p": 0.9,
                    "num_predict": 150,
                },
            },
            timeout=60,
        )
        response.raise_for_status()

        data = response.json()
        ai_response = data.get("response", "").strip()

        if not ai_response:
            raise HTTPException(
                status_code=502,
                detail="Ollama returned an empty response.",
            )

        return {
            "response": ai_response,
        }

    except HTTPException:
        raise

    except requests.exceptions.Timeout:
        raise HTTPException(
            status_code=504,
            detail="The local AI model took too long to respond.",
        )

    except requests.exceptions.RequestException:
        raise HTTPException(
            status_code=503,
            detail="Could not connect to Ollama. Make sure Ollama is running.",
        )

    except Exception as exc:
        print(exc)

        raise HTTPException(
            status_code=500,
            detail="Unexpected backend error while generating a response.",
        )
