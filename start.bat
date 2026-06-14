@echo off
cd /d "%~dp0"
echo Starting backend on http://127.0.0.1:8765
start "Research Backend" cmd /k "call start-backend.bat"
echo Starting frontend on http://localhost:5173
start "Research Frontend" cmd /k "npm run dev --prefix frontend"
echo.
echo Both servers are starting in new windows.
echo Open http://localhost:5173 in your browser.
