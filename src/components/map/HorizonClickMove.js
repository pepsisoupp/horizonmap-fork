import { useContext } from 'react';
import { useMapEvents } from 'react-leaflet';
import MainContext from '../../contexts/MainContext';

export default function HorizonClickMove() {
  const { mode, inProgress, setMarkerPos } = useContext(MainContext);

  useMapEvents({
    click(e) {
      if (mode !== 'horizon' || inProgress !== 0) return;
      setMarkerPos({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return null;
}
