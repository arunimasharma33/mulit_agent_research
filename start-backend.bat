@echo off
cd /d "%~dp0"

echo Checking for an existing backend...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8765" ^| findstr "LISTENING"') do (
  echo Stopping old backend process %%a
  taskkill /PID %%a /F >nul 2>&1
)

echo Starting backend on http://127.0.0.1:8765
.venv\Scripts\python.exe -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8765
if errorlevel 1 (
  echo.
  echo Backend failed to start. Try running this file as Administrator,
  echo or run manually: .venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8765
  pause
)
