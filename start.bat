@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo TubeQueue 를 http://localhost:8820 에서 엽니다. 이 창을 닫으면 서버가 꺼져요.
start "" cmd /c "timeout /t 1 >nul & start http://localhost:8820/"
python -m http.server 8820 --bind 127.0.0.1
