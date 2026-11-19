from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import Restaurant

app = FastAPI(title="Restaurant Notes")
# allows cross origin requests (required for other ppl to use ur api)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# db equivalent
restaurants = []

@app.get("/restaurants")
def get_restaurants():
    return restaurants

@app.post("/restaurants", status_code=201)
def add_restaurant(restaurant: Restaurant):
    restaurants.append(restaurant)
    return restaurant
