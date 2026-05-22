AI Chatbot
==========

Local React + FastAPI chatbot that sends messages to Ollama.

Run the app
-----------

Open one terminal for the backend:

```powershell
cd D:\MyProjects\ai_chatbot\backend
uvicorn app.main:app --reload
```

If `uvicorn` is not recognized, activate the backend virtual environment once:

```powershell
.\venv\Scripts\Activate.ps1
```

Open another terminal for the frontend:

```powershell
cd D:\MyProjects\ai_chatbot\frontend
npm run dev
```

Then open:

```text
http://127.0.0.1:5173/
```

Requirements
------------

- Ollama must be running.
- The `llama3.2:3b` model must be installed.
- Backend runs on `http://127.0.0.1:8000`.
- Frontend runs on `http://127.0.0.1:5173`.

Useful checks
-------------

Backend health check:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/
```

Manual chat API test:

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:8000/chat -Method Post -ContentType "application/json" -Body '{"message":"hi","personality":"friendly"}'
```
