import { useContext } from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import MainContext from '../../contexts/MainContext';

const searchIcon = L.divIcon({
  className: 'los-dot-icon',
  html: '<div style="width:14px;height:14px;border-radius:999px;background:#ef4444;border:2px solid rgba(255,255,255,0.95);box-shadow:0 2px 8px rgba(0,0,0,0.35)"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export default function SearchPinMarker() {
  const { searchPinPos, setSearchPinPos } = useContext(MainContext);

  if (!searchPinPos) return null;

  return (
    <Marker
      position={searchPinPos}
      draggable
      icon={searchIcon}
      eventHandlers={{
        click: () => setSearchPinPos(null),
        dragend: (e) => {
          const p = e.target.getLatLng();
          setSearchPinPos({ lat: p.lat, lng: p.lng });
        },
      }}
    />
  );
}
