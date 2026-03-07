import { useCallback, useContext, useEffect } from "react";
import L from "leaflet";
import MainContext from "../../contexts/MainContext";
import Constants from "../../helpers/constants";
import Heightmap from "../../helpers/heightmap";
import MapHelper from "../../helpers/mapHelper";
import { lerpLatLng, sampleElevationImageData, clamp } from "../../helpers/los";

function computeBoundsForSegment(a, b, padMeters = 1500) {
  const north = Math.max(a.lat, b.lat);
  const south = Math.min(a.lat, b.lat);
  const east = Math.max(a.lng, b.lng);
  const west = Math.min(a.lng, b.lng);

  const earthLatCircle = 40008;
  const earthLngCircle = 40075;
  const latDeg = ((padMeters / 1000) / earthLatCircle) * 360;
  const centerLat = (a.lat + b.lat) / 2;
  const lngCircleHere = earthLngCircle * Math.cos(centerLat * Math.PI / 180);
  const lngDeg = lngCircleHere > 1e-6 ? ((padMeters / 1000) / lngCircleHere) * 360 : latDeg;

  return {
    north: north + latDeg,
    south: south - latDeg,
    east: east + lngDeg,
    west: west - lngDeg,
  };
}

function autoSampleStepMeters(totalMeters) {
  const target = 900;
  const raw = totalMeters / target;
  return clamp(raw, Constants.los.minSampleStep, Constants.los.maxSampleStep);
}

export default function LosManager() {
  const {
    mode,
    map,
    heightmapZoom,
    losA,
    losB,
    setLosProfile,
    setHeightmapInfo,
    setInProgress,
  } = useContext(MainContext);

  const loadAndCompute = useCallback(async () => {
    if (!map) return;
    if (mode !== "los") return;
    if (!losA || !losB) {
      setLosProfile(null);
      return;
    }

    setInProgress(1);

    const bounds = computeBoundsForSegment(losA, losB, Constants.los.boundsPadMeters);
    const pixelBounds = MapHelper.latLngBoundsToPixel(bounds, heightmapZoom, map);
    const tileBounds = MapHelper.pixelBoundsToTile(pixelBounds);
    const tiles = await Heightmap.loadTilesInBounds(tileBounds, heightmapZoom);
    const combinedTiles = Heightmap.combineTiles(tiles, tileBounds);

    setHeightmapInfo({
      imageData: combinedTiles,
      circleBounds: bounds,
      pixelBounds,
      zoom: heightmapZoom,
    });

    const aLL = L.latLng(losA);
    const bLL = L.latLng(losB);
    const totalMeters = aLL.distanceTo(bLL);
    const stepMeters = autoSampleStepMeters(totalMeters);
    const count = clamp(Math.ceil(totalMeters / stepMeters) + 1, 150, 2000);

    const aPx = map.project(losA, heightmapZoom);
    const bPx = map.project(losB, heightmapZoom);
    const originX = pixelBounds.west;
    const originY = pixelBounds.north;

    const profile = [];
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0 : i / (count - 1);
      const gx = aPx.x + (bPx.x - aPx.x) * t;
      const gy = aPx.y + (bPx.y - aPx.y) * t;
      const lx = gx - originX;
      const ly = gy - originY;
      const elev = sampleElevationImageData(combinedTiles, lx, ly);
      const latlng = lerpLatLng(losA, losB, t);
      profile.push({
        i,
        t,
        dist: totalMeters * t,
        elev,
        latlng,
      });
    }

    setLosProfile({
      bounds,
      pixelBounds,
      zoom: heightmapZoom,
      totalMeters,
      stepMeters,
      profile,
    });

    setInProgress(0);
  }, [map, mode, heightmapZoom, losA, losB, setLosProfile, setHeightmapInfo, setInProgress]);

  useEffect(() => {
    loadAndCompute();
  }, [loadAndCompute]);

  return null;
}
