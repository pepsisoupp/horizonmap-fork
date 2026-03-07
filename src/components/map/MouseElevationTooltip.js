import { useContext, useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import MainContext from '../../contexts/MainContext';
import { decodeElevationMeters } from '../../helpers/elevation';
import { formatMgrs } from '../../helpers/mgrs';

function sampleElevationMeters({ imageData, pixelBounds, zoom, map }, latlng) {
  if (!imageData || !pixelBounds || !map) return null;
  const p = map.project(latlng, zoom);
  const x = Math.floor(p.x - pixelBounds.west);
  const y = Math.floor(p.y - pixelBounds.north);
  if (x < 0 || y < 0 || x >= imageData.width || y >= imageData.height) return null;

  const i = (y * imageData.width + x) * 4;
  const d = imageData.data;
  return decodeElevationMeters(d[i], d[i + 1], d[i + 2]);
}

export default function MouseElevationTooltip() {
  const map = useMap();
  const { heightmapInfo } = useContext(MainContext);

  const tooltipRef = useRef(null);
  const rafRef = useRef(0);
  const lastEventRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    // Create one tooltip instance and update it on mouse move.
    const tooltip = L.tooltip({
      permanent: false,
      direction: 'right',
      offset: L.point(12, 0),
      opacity: 0.95,
      className: 'mouse-elevation-tooltip'
    });
    tooltipRef.current = tooltip;

    const scheduleUpdate = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        const e = lastEventRef.current;
        if (!e) return;

        const elev = sampleElevationMeters({ ...heightmapInfo, map }, e.latlng);
        if (elev === null || !Number.isFinite(elev)) {
          if (map.hasLayer(tooltip)) map.removeLayer(tooltip);
          return;
        }

        const rounded = Math.round(elev);
        const mgrs = formatMgrs(e.latlng, 5);
        tooltip
          .setLatLng(e.latlng)
          .setContent(`<div><b>${rounded}</b> m</div><div class="mouse-elevation-tooltip-sub">${mgrs || 'MGRS unavailable'}</div>`);

        if (!map.hasLayer(tooltip)) tooltip.addTo(map);
      });
    };

    const onMove = (e) => {
      lastEventRef.current = e;
      scheduleUpdate();
    };

    const onOut = () => {
      lastEventRef.current = null;
      if (map.hasLayer(tooltip)) map.removeLayer(tooltip);
    };

    map.on('mousemove', onMove);
    map.on('mouseout', onOut);

    return () => {
      map.off('mousemove', onMove);
      map.off('mouseout', onOut);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      lastEventRef.current = null;
      if (map.hasLayer(tooltip)) map.removeLayer(tooltip);
      tooltipRef.current = null;
    };
  }, [map, heightmapInfo]);

  return null;
}
