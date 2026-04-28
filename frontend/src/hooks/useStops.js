import React from "react";
import { useEffect, useState } from "react";
import { fetchStopsByBBox } from "../api.js";

export function useStops(bbox) {
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadStops() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchStopsByBBox(bbox);
        if (!cancelled) {
          setStops(data.stops);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unknown error");
          setStops([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadStops();

    return () => {
      cancelled = true;
    };
  }, [bbox.minLon, bbox.minLat, bbox.maxLon, bbox.maxLat]);

  return { stops, loading, error };
}
