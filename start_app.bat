@echo off
echo Starting DocuMind...

:: Start Backend
start "DocuMind Backend" cmd /k "cd backend && echo Starting Server... && .\venv\Scripts\python -m uvicorn main:app --reload --port 8000"

:: Start Frontend
start "DocuMind Frontend" cmd /k "cd frontend && npm run dev"

echo DocuMind is running!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8000/docs
pause
