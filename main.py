from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from models import Spot, Tip

app = FastAPI(title="My first API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# Our database for today: a list. Restarting the server resets it.
spots = [{"id": 1, "name": "Campus Point", "tip": "Go for the sunset."}]
next_id = 2


@app.get("/")
def hello():
    return {"message": "Hello from my API!", "routes": "/spots"}


# GET reads something. Try /spots in your browser!
@app.get("/spots")
def get_spots():
    return spots


# POST creates something. Send JSON: {"name": "...", "tip": "..."}
@app.post("/spots", status_code=201)
def add_spot(spot: Spot):
    global next_id
    new_spot = {"id": next_id, **spot.model_dump()}
    next_id += 1
    spots.append(new_spot)
    return new_spot


# PATCH changes just the tip on an existing spot.
@app.patch("/spots/{spot_id}")
def update_spot(spot_id: int, update: Tip):
    for spot in spots:
        if spot["id"] == spot_id:
            spot["tip"] = update.tip
            return spot
    raise HTTPException(status_code=404, detail="Spot not found.")


# DELETE removes something. 204 means success with no response body.
@app.delete("/spots/{spot_id}", status_code=204)
def delete_spot(spot_id: int):
    for spot in spots:
        if spot["id"] == spot_id:
            spots.remove(spot)
            return Response(status_code=204)
    raise HTTPException(status_code=404, detail="Spot not found.")
