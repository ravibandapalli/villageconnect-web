"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix default icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function MapScreen({ onConfirm }: { onConfirm?: (loc: { lat: number, lng: number }) => void }) {
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = ""; // Shows default browser confirmation
  };

  window.addEventListener("beforeunload", handleBeforeUnload);

  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}, []);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setMarker({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return marker ? <Marker position={marker} /> : null;
  }

  const confirmLocation = () => {
    if (marker) {
      if (onConfirm) onConfirm(marker);
      alert(`Location Saved\nLatitude: ${marker.lat}\nLongitude: ${marker.lng}`);
    } else {
      alert("Please select a location first.");
    }
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <MapContainer center={{ lat: 12.9716, lng: 77.5946 }} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker />
      </MapContainer>

      <button
        onClick={confirmLocation}
        style={{
          position: "absolute",
          bottom: 30,
          left: "10%",
          right: "10%",
          backgroundColor: "#1E90FF",
          color: "#fff",
          padding: "15px",
          borderRadius: 10,
          fontWeight: "bold",
          fontSize: 16,
          border: "none",
          cursor: "pointer",
        }}
      >
        Confirm Location
      </button>
    </div>
  );
}
