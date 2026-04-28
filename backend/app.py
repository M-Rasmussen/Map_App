import os

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

allowed_origins = os.environ.get("CORS_ORIGINS", "http://localhost:5173").split(",")
CORS(app, origins=[origin.strip() for origin in allowed_origins if origin.strip()])

STOPS = [
    {
        "id": "STOP_1",
        "name": "Main St & 3rd Ave",
        "lat": 40.7321,
        "lon": -73.9911,
        "routes": ["10", "M2"],
    },
    {
        "id": "STOP_2",
        "name": "Broadway & 8th",
        "lat": 40.7350,
        "lon": -73.9900,
        "routes": ["15"],
    },
    {
        "id": "STOP_3",
        "name": "Pine & Market",
        "lat": 40.7285,
        "lon": -73.9950,
        "routes": ["22", "10"],
    },
    {
        "id": "STOP_4",
        "name": "Union Square",
        "lat": 40.7308,
        "lon": -73.9973,
        "routes": ["L", "N", "Q"],
    },
    {
        "id": "STOP_5",
        "name": "East Village",
        "lat": 40.7260,
        "lon": -73.9815,
        "routes": ["M14"],
    },
]

def parse_float(value, name):
    try:
        return float(value)
    except (TypeError, ValueError):
        raise ValueError(f"Invalid {name}")

@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})

@app.get("/api/stops")
def get_stops():
    try:
        min_lon = parse_float(request.args.get("minLon"), "minLon")
        min_lat = parse_float(request.args.get("minLat"), "minLat")
        max_lon = parse_float(request.args.get("maxLon"), "maxLon")
        max_lat = parse_float(request.args.get("maxLat"), "maxLat")
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    if min_lon > max_lon or min_lat > max_lat:
        return jsonify({"error": "Invalid bounding box"}), 400

    matching_stops = []
    for stop in STOPS:
        if (
            min_lon <= stop["lon"] <= max_lon
            and min_lat <= stop["lat"] <= max_lat
        ):
            matching_stops.append(stop)

    return jsonify({
        "bbox": {
            "minLon": min_lon,
            "minLat": min_lat,
            "maxLon": max_lon,
            "maxLat": max_lat,
        },
        "count": len(matching_stops),
        "stops": matching_stops,
    })

@app.get("/api/stops/<stop_id>")
def get_stop(stop_id):
    stop = next((s for s in STOPS if s["id"] == stop_id), None)
    if not stop:
        return jsonify({"error": "Stop not found"}), 404
    return jsonify(stop)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    debug = os.environ.get("FLASK_DEBUG", "").lower() in {"1", "true", "yes"}
    app.run(host="0.0.0.0", port=port, debug=debug)
