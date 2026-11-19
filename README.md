# API starter

Python 3.10+. Routes are in `main.py`; request models are in `models.py`.

```sh
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Windows PowerShell: activate with `.venv\Scripts\Activate.ps1`.

Open http://localhost:8000/docs to try GET, POST, PATCH, and DELETE.
Data resets when the server restarts. Cross-origin requests are allowed.
Share your Wi-Fi IP and port 8000 with the room; registration instructions are in the platform README.
