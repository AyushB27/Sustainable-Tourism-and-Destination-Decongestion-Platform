@echo off
cd /d "%~dp0"
if not exist ".venv" (
    echo [EcoRoute] Virtual environment not found. Creating .venv...
    python -m venv .venv
    call .venv\Scripts\activate.bat
    pip install -r requirements.txt
) else (
    call .venv\Scripts\activate.bat
)
python main.py
