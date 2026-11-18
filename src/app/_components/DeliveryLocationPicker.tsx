"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L, { type LatLngExpression } from "leaflet";
import { LocateFixed, MapPin } from "lucide-react";

type DeliveryLocationSelection = {
  latitude: number;
  longitude: number;
  addressLine?: string;
  city?: string;
  formattedAddress?: string;
  isResolvingAddress?: boolean;
  addressError?: string;
};

type DeliveryLocationPickerProps = {
  onLocationSelect: (location: DeliveryLocationSelection) => void;
};

type Position = {
  latitude: number;
  longitude: number;
};

type PhotonFeature = {
  properties?: {
    name?: string;
    housenumber?: string;
    street?: string;
    district?: string;
    suburb?: string;
    neighbourhood?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
};

// CSS-based marker keeps the marker's appearance in the stylesheet.
const deliveryMarkerIcon = L.divIcon({
  className: "delivery-map-marker",
  html: '<span class="delivery-map-marker__pin" aria-hidden="true"></span>',
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

function uniqueParts(parts: Array<string | undefined>) {
  return [...new Set(parts.map((part) => part?.trim()).filter(Boolean))];
}

async function reverseGeocode(
  latitude: number,
  longitude: number,
  signal: AbortSignal,
): Promise<
  Pick<DeliveryLocationSelection, "addressLine" | "city" | "formattedAddress">
> {
  const query = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    lang: "en",
  });

  // Photon provides OpenStreetMap-based reverse geocoding without a client API key.
  const response = await fetch(
    `https://photon.komoot.io/reverse?${query.toString()}`,
    {
      signal,
      headers: { Accept: "application/json" },
    },
  );

  if (!response.ok) {
    throw new Error("Address lookup is temporarily unavailable.");
  }

  const result = (await response.json()) as { features?: PhotonFeature[] };
  const properties = result.features?.[0]?.properties;

  if (!properties) {
    throw new Error("No address details were found for this map point.");
  }

  const street = uniqueParts([properties.housenumber, properties.street]).join(
    " ",
  );

  const neighbourhood =
    properties.suburb ?? properties.neighbourhood ?? properties.district;

  const city =
    properties.city ??
    properties.town ??
    properties.village ??
    properties.municipality ??
    properties.county ??
    "";

  const addressLine = uniqueParts([
    street || properties.name,
    neighbourhood,
    properties.postcode,
  ]).join(", ");

  const formattedAddress = uniqueParts([
    addressLine || properties.name,
    city,
    properties.state,
    properties.country,
  ]).join(", ");

  return {
    addressLine: addressLine || formattedAddress,
    city,
    formattedAddress,
  };
}

export default function DeliveryLocationPicker({
  onLocationSelect,
}: DeliveryLocationPickerProps) {
  const [position, setPosition] = useState<Position | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [error, setError] = useState("");
  const [addressStatus, setAddressStatus] = useState("");
  const lookupController = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => lookupController.current?.abort();
  }, []);

  async function handleLocationSelect(latitude: number, longitude: number) {
    const nextPosition = { latitude, longitude };
    setPosition(nextPosition);
    setError("");
    setAddressStatus("Finding address details...");
    setIsResolvingAddress(true);

    lookupController.current?.abort();
    const controller = new AbortController();
    lookupController.current = controller;

    // Send coordinates immediately so they are retained even if address lookup fails.
    onLocationSelect({
      ...nextPosition,
      addressLine: "",
      city: "",
      formattedAddress: "",
      isResolvingAddress: true,
    });

    try {
      const address = await reverseGeocode(
        latitude,
        longitude,
        controller.signal,
      );

      if (controller.signal.aborted) return;

      setAddressStatus(
        address.formattedAddress
          ? `Address found: ${address.formattedAddress}`
          : "Address details found.",
      );
      onLocationSelect({
        ...nextPosition,
        ...address,
        isResolvingAddress: false,
      });
    } catch (lookupError) {
      if (controller.signal.aborted) return;

      const message =
        lookupError instanceof Error
          ? lookupError.message
          : "Unable to find address details for this point.";

      setAddressStatus("Could not retrieve the address. Enter it manually.");
      onLocationSelect({
        ...nextPosition,
        isResolvingAddress: false,
        addressError: message,
      });
    } finally {
      if (!controller.signal.aborted) {
        setIsResolvingAddress(false);
      }
    }
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
        void handleLocationSelect(
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

      <div className="delivery-map-wrapper">
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

                  void handleLocationSelect(coordinates.lat, coordinates.lng);
                },
              }}
            />
          )}
        </MapContainer>

        {!position && (
          <div className="delivery-map-hint">
            <MapPin size={14} aria-hidden="true" />
            <span>Tap map to place pin</span>
          </div>
        )}
      </div>

      {isResolvingAddress && (
        <p className="form-note" aria-live="polite">
          Finding the address for your selected point...
        </p>
      )}

      {!isResolvingAddress && addressStatus && (
        <p className="form-note" aria-live="polite">
          {addressStatus}
        </p>
      )}

      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
