import { useContext } from "react";
import { Marker, Polyline, useMapEvents } from "react-leaflet";
import L from "leaflet";
import MainContext from "../../contexts/MainContext";

function coloredDot(color) {
  return L.divIcon({
    className: "los-dot-icon",
    html: `<div style="width:14px;height:14px;border-radius:999px;background:${color};border:2px solid rgba(255,255,255,0.95);box-shadow:0 2px 8px rgba(0,0,0,0.35)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

const blueIcon = coloredDot("#1e6bff");
const greenIcon = coloredDot("#1db954");

export default function LosLayer() {
  const {
    mode,
    losA,
    setLosA,
    losB,
    setLosB,
    losProbePos,
    setLosProbePos,
  } = useContext(MainContext);

  useMapEvents({
    click(e) {
      if (mode !== "los") return;
      const ll = { lat: e.latlng.lat, lng: e.latlng.lng };

      // Shift+Click updates A, normal click updates B.
      if (!losA || e.originalEvent?.shiftKey) {
        setLosA(ll);
        setLosProbePos(null);
        return;
      }
      if (!losB) {
        setLosB(ll);
        setLosProbePos(null);
        return;
      }
      setLosB(ll);
      setLosProbePos(null);
    },
  });

  if (mode !== "los") return null;

  const line = losA && losB ? [losA, losB] : null;

  return (
    <>
      {line && <Polyline positions={line} pathOptions={{ weight: 3, opacity: 0.9 }} />}

      {losA && (
        <Marker
          position={losA}
          draggable
          icon={blueIcon}
          eventHandlers={{
            dragend: (e) => {
              const p = e.target.getLatLng();
              setLosA({ lat: p.lat, lng: p.lng });
            },
          }}
        />
      )}

      {losB && (
        <Marker
          position={losB}
          draggable
          icon={greenIcon}
          eventHandlers={{
            dragend: (e) => {
              const p = e.target.getLatLng();
              setLosB({ lat: p.lat, lng: p.lng });
            },
          }}
        />
      )}

      {losProbePos && (
        <Marker
          position={losProbePos}
          opacity={0.95}
          eventHandlers={{
            click: () => setLosProbePos(null),
          }}
        />
      )}
    </>
  );
}
