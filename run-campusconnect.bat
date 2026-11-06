@echo off
title CampusConnect - Launcher
color 0B
echo ========================================================
echo       Starting CampusConnect Full-Stack Platform...
echo ========================================================
echo.

cd /d "%~dp0\scratch\campusconnect"

echo [1/3] Starting Backend API Server (Port 5000)...
start "CampusConnect Server (Port 5000)" cmd /k "cd server && npm run dev"

echo [2/3] Starting Frontend Client (Port 5173)...
start "CampusConnect Frontend (Port 5173)" cmd /k "cd client && npm run dev"

echo [3/3] Opening Browser...
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo ========================================================
echo CampusConnect is now running!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.
echo Demo Accounts:
echo   Student:   student@campusconnect.edu   / password123
echo   Organizer: organizer@campusconnect.edu / password123
echo   Admin:     admin@campusconnect.edu     / password123
echo ========================================================
echo Keep the server windows open while testing.
pause

