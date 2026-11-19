# API starter

- Use Python 3.10+
- API routes are in `main.py`
- Request models are in `models.py`

Setup:
```sh
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Windows PowerShell: activate with `.venv\Scripts\Activate.ps1`.

Open http://localhost:8000/docs to test.
