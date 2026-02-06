@echo off
echo Starting DocuMind...

:: Start Backend
:: Use 'python -m pip' to avoid locking pip.exe
start "DocuMind Backend" cmd /k "cd backend && echo Installing dependencies... && python -m pip install --upgrade pip && python -m pip install -r requirements.txt && echo Starting Server... && python -m uvicorn main:app --reload --port 8000"

:: Start Frontend
start "DocuMind Frontend" cmd /k "cd frontend && npm run dev"

echo DocuMind is running!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8000/docs
pause
