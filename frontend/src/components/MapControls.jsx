import React from "react";
export default function MapControls({ onMoveWest, onMoveEast, onMoveNorth, onMoveSouth }) {
  return (
    <div className="controls">
      <button onClick={onMoveWest}>Move West</button>
      <button onClick={onMoveEast}>Move East</button>
      <button onClick={onMoveNorth}>Move North</button>
      <button onClick={onMoveSouth}>Move South</button>
    </div>
  );
}
