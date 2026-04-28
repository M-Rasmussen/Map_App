import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const openStreetMapStyle = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm",
    },
  ],
};

export default function MapView({
  stops,
  selectedStopId,
  onSelectStop,
  onViewportChange,
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [-73.9911, 40.7321],
      zoom: 13,
      style: openStreetMapStyle,
    });

    mapRef.current = map;

    map.on("load", () => {
      const bounds = map.getBounds();
      onViewportChange({
        minLon: bounds.getWest(),
        minLat: bounds.getSouth(),
        maxLon: bounds.getEast(),
        maxLat: bounds.getNorth(),
      });
    });

    map.on("moveend", () => {
      const bounds = map.getBounds();
      onViewportChange({
        minLon: bounds.getWest(),
        minLat: bounds.getSouth(),
        maxLon: bounds.getEast(),
        maxLat: bounds.getNorth(),
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [onViewportChange]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    stops.forEach((stop) => {
      const popupContent = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = stop.name;
      const idLine = document.createElement("div");
      idLine.textContent = `ID: ${stop.id}`;
      const routesLine = document.createElement("div");
      routesLine.textContent = `Routes: ${stop.routes.join(", ")}`;
      popupContent.append(title, idLine, routesLine);

      const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupContent);

      const el = document.createElement("div");
      el.style.width = "14px";
      el.style.height = "14px";
      el.style.borderRadius = "50%";
      el.style.background = stop.id === selectedStopId ? "#2563eb" : "#dc2626";
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 0 0 1px rgba(0,0,0,0.25)";
      el.style.cursor = "pointer";

      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.15)";
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
      });

      el.addEventListener("click", () => {
        onSelectStop(stop.id);
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([stop.lon, stop.lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [stops, selectedStopId, onSelectStop]);

  return <div ref={mapContainerRef} style={{ width: "100%", height: "500px", borderRadius: "12px" }} />;
}
