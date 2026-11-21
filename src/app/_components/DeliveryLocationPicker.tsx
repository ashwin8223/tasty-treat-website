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

// CSS-based marker keeps the marker's appearance in globals.css.
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
    <div className="w-full min-w-0">
      <div className="mb-3 flex items-center justify-between gap-3.5 max-[700px]:flex-col max-[700px]:items-start max-[700px]:gap-2.25">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="shrink-0 text-accent">
            <MapPin size={19} aria-hidden="true" />
          </span>

          <div>
            <h3 className="m-0 font-sans text-[15px] leading-[1.35] font-bold tracking-[-0.025em] text-foreground">
              Delivery address
            </h3>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex min-h-9.75 shrink-0 items-center justify-center gap-2.5 rounded-lg border border-accent/35 bg-accent/9 px-3.25 font-sans text-[10px] font-bold text-accent-hover transition-[background-color,border-color,transform] duration-200 hover:enabled:-translate-y-px hover:enabled:border-accent hover:enabled:bg-accent/16 disabled:cursor-wait disabled:opacity-65 max-[700px]:min-h-10.5 max-[700px]:w-full"
          onClick={handleCurrentLocation}
          disabled={isLocating}
        >
          <LocateFixed size={16} aria-hidden="true" />
          {isLocating ? "Locating..." : "Use my location"}
        </button>
      </div>

      <div className="relative isolate h-75 w-full overflow-hidden rounded-[11px] border border-line bg-surface shadow-[0_8px_24px_rgba(0,0,0,0.18)] max-[768px]:h-58.75 max-[480px]:h-53.75">
        <MapContainer
          center={defaultPosition}
          zoom={12}
          scrollWheelZoom={true}
          className="relative z-0 h-full min-h-0 w-full rounded-[inherit] border-0 bg-surface"
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
          <div className="pointer-events-none absolute right-3 bottom-7 z-500 inline-flex max-w-[calc(100%-24px)] items-center gap-1.75 rounded-lg border border-white/14 bg-[#101110]/90 px-2.75 py-2 font-sans text-[11px] leading-[1.35] font-[550] text-foreground backdrop-blur-[8px] max-[480px]:right-2 max-[480px]:bottom-6 max-[480px]:px-2.25 max-[480px]:py-1.75 max-[480px]:text-[10px]">
            <MapPin
              size={14}
              className="shrink-0 text-accent"
              aria-hidden="true"
            />
            <span>Tap map to place pin</span>
          </div>
        )}
      </div>

      {isResolvingAddress && (
        <p
          className="mt-2 text-[9px] leading-[1.6] text-[#858b82]"
          aria-live="polite"
        >
          Finding the address for your selected point...
        </p>
      )}

      {!isResolvingAddress && addressStatus && (
        <p
          className="mt-2 text-[9px] leading-[1.6] text-[#858b82]"
          aria-live="polite"
        >
          {addressStatus}
        </p>
      )}

      {error && (
        <p
          className="mt-1.5 block text-[12px] leading-[1.4] text-[#ef6b5b]"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
