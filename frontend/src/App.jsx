import React, { useCallback, useEffect, useState } from "react";
import { fetchStopById } from "./api.js";
import { useStops } from "./hooks/useStops.js";
import MapView from "./components/MapView.jsx";
import StopList from "./components/StopList.jsx";
import StopDetails from "./components/StopDetails.jsx";
export default function App() {
  const [bbox, setBBox] = useState({
    minLon: -74.0,
    minLat: 40.725,
    maxLon: -73.985,
    maxLat: 40.737,
  });

  const [selectedStopId, setSelectedStopId] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  const { stops, loading, error } = useStops(bbox);

  const handleViewportChange = useCallback((nextBBox) => {
    setBBox(nextBBox);
  }, []);

  const handleSelectStop = useCallback((stopId) => {
    setSelectedStopId(stopId);
  }, []);

  useEffect(() => {
    if (!selectedStopId) {
      setSelectedStop(null);
      return;
    }

    let cancelled = false;

    async function loadStopDetails() {
      setDetailsLoading(true);
      setDetailsError("");

      try {
        const stop = await fetchStopById(selectedStopId);
        if (!cancelled) {
          setSelectedStop(stop);
        }
      } catch (err) {
        if (!cancelled) {
          setDetailsError(err.message || "Failed to load stop details");
          setSelectedStop(null);
        }
      } finally {
        if (!cancelled) {
          setDetailsLoading(false);
        }
      }
    }

    loadStopDetails();

    return () => {
      cancelled = true;
    };
  }, [selectedStopId]);

  return (
    <div className="app-shell">
      <h1>Transit Stops Map Demo</h1>
      <p>Real Mapbox map with viewport-driven stop loading.</p>

      <div className="panel">
        <MapView
          stops={stops}
          selectedStopId={selectedStopId}
          onSelectStop={handleSelectStop}
          onViewportChange={handleViewportChange}
        />
      </div>

      <div className="layout">
        <section>
          <h2>Stops in View</h2>
          {loading && <p>Loading stops...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && (
            <StopList
              stops={stops}
              selectedStopId={selectedStopId}
              onSelectStop={handleSelectStop}
            />
          )}
        </section>

        <aside>
          <h2>Selected Stop</h2>
          {detailsLoading && <p>Loading stop details...</p>}
          {detailsError && <p className="error">{detailsError}</p>}
          {!detailsLoading && !detailsError && <StopDetails stop={selectedStop} />}
        </aside>
      </div>
    </div>
  );
}