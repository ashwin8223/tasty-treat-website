"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L, { type LatLngExpression } from "leaflet";
import { LocateFixed, MapPin } from "lucide-react";

type DeliveryLocationPickerProps = {
  onLocationSelect: (latitude: number, longitude: number) => void;
};

type Position = {
  latitude: number;
  longitude: number;
};

// Custom marker avoids Leaflet's default image-path issues with Next.js.
const deliveryMarkerIcon = L.divIcon({
  className: "delivery-map-marker",
  html: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="48"
      viewBox="0 0 40 48"
      style="display:block;overflow:visible"
    >
      <path
        d="M20 46C20 46 3 27.5 3 19C3 9.6 10.6 2 20 2C29.4 2 37 9.6 37 19C37 27.5 20 46 20 46Z"
        fill="#E87532"
        stroke="#FFFFFF"
        stroke-width="2.5"
      />
      <circle cx="20" cy="19" r="7" fill="#FFFFFF" />
      <circle cx="20" cy="19" r="3" fill="#E87532" />
    </svg>
  `,
  iconSize: [40, 48],
  iconAnchor: [20, 48],
});

function MapPositionController({ position }: { position: Position | null }) {
  const map = useMap();

  useEffect(() => {
    if (!position) return;

    map.flyTo(
      [position.latitude, position.longitude],
      Math.max(map.getZoom(), 15),
      { duration: 0.8 },
    );
  }, [map, position]);

  return null;
}

function MapClickHandler({
  onLocationSelect,
}: {
  onLocationSelect: (latitude: number, longitude: number) => void;
}) {
  useMapEvents({
    click(event) {
      onLocationSelect(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

export default function DeliveryLocationPicker({
  onLocationSelect,
}: DeliveryLocationPickerProps) {
  const [position, setPosition] = useState<Position | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState("");

  function handleLocationSelect(latitude: number, longitude: number) {
    setPosition({ latitude, longitude });
    setError("");
    onLocationSelect(latitude, longitude);
  }

  function handleCurrentLocation() {
    if (!navigator.geolocation) {
      setError("Your browser does not support location detection.");
      return;
    }

    setIsLocating(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (location) => {
        handleLocationSelect(
          location.coords.latitude,
          location.coords.longitude,
        );
        setIsLocating(false);
      },
      () => {
        setError(
          "Unable to detect your location. Please allow location access or select a point on the map.",
        );
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      },
    );
  }

  const defaultPosition: LatLngExpression = [13.0827, 80.2707];

  return (
    <div className="delivery-location-picker">
      <div className="delivery-location-heading">
        <div className="delivery-location-title">
          <span className="delivery-location-icon">
            <MapPin size={19} aria-hidden="true" />
          </span>

          <div className="delivery-location-copy">
            <h3>Delivery address</h3>
          </div>
        </div>

        <button
          type="button"
          className="button button-secondary delivery-location-button"
          onClick={handleCurrentLocation}
          disabled={isLocating}
        >
          <LocateFixed size={16} aria-hidden="true" />
          {isLocating ? "Locating..." : "Use my location"}
        </button>
      </div>

      <div className="delivery-map-wrapper" style={{ position: "relative" }}>
        <MapContainer
          center={defaultPosition}
          zoom={12}
          scrollWheelZoom={true}
          className="delivery-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onLocationSelect={handleLocationSelect} />

          <MapPositionController position={position} />

          {position && (
            <Marker
              position={[position.latitude, position.longitude]}
              icon={deliveryMarkerIcon}
              draggable={true}
              eventHandlers={{
                dragend(event) {
                  const marker = event.target;
                  const coordinates = marker.getLatLng();

                  handleLocationSelect(coordinates.lat, coordinates.lng);
                },
              }}
            />
          )}
        </MapContainer>

        {!position && (
          <div
            className="delivery-map-hint"
            style={{
              position: "absolute",
              left: "50%",
              bottom: "14px",
              transform: "translateX(-50%)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
              width: "max-content",
              maxWidth: "calc(100% - 24px)",
              padding: "10px 14px",
              borderRadius: "999px",
              border: "1px solid rgba(255, 255, 255, 0.22)",
              background: "rgba(24, 24, 27, 0.88)",
              color: "#FFFFFF",
              fontSize: "13px",
              fontWeight: 600,
              lineHeight: 1.2,
              textAlign: "center",
              boxShadow: "0 3px 12px rgba(0, 0, 0, 0.28)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              pointerEvents: "none",
            }}
          >
            <MapPin size={14} aria-hidden="true" />
            <span>Tap map to place pin</span>
          </div>
        )}
      </div>

      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
