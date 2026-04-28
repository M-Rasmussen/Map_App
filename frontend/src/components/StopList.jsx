import React from "react";
export default function StopList({ stops, selectedStopId, onSelectStop }) {
  if (stops.length === 0) {
    return <p>No stops in this viewport.</p>;
  }

  return (
    <ul className="stop-list">
      {stops.map((stop) => {
        const isSelected = stop.id === selectedStopId;
        return (
          <li
            key={stop.id}
            className={`stop-card ${isSelected ? "selected" : ""}`}
            onClick={() => onSelectStop(stop.id)}
          >
            <div className="stop-title">{stop.name}</div>
            <div>ID: {stop.id}</div>
            <div>Lat/Lon: {stop.lat}, {stop.lon}</div>
            <div>Routes: {stop.routes.join(", ")}</div>
          </li>
        );
      })}
    </ul>
  );
}
