import React from "react";
export default function StopDetails({ stop }) {
  if (!stop) {
    return <p>Select a stop to view details.</p>;
  }

  return (
    <div className="panel">
      <h3>{stop.name}</h3>
      <p><strong>ID:</strong> {stop.id}</p>
      <p><strong>Latitude:</strong> {stop.lat}</p>
      <p><strong>Longitude:</strong> {stop.lon}</p>
      <p><strong>Routes:</strong> {stop.routes.join(", ")}</p>
    </div>
  );
}
