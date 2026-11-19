# API starter

- Use Python 3.10+
- API routes are in `main.py`
- Request models are in `models.py`

Setup (run from this folder):
```sh
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
fastapi dev main.py --port 8000
```

Windows PowerShell: activate with `.venv\Scripts\Activate.ps1`.

Open http://localhost:8000/docs to test with FastAPI’s interactive Swagger UI. `fastapi dev` automatically reloads your app when you save changes. To share it with the room, use http://YOUR_WIFI_IP:8000. Swagger UI loads its assets from a CDN, so it needs internet access.
