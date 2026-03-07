import { forward, toPoint } from 'mgrs';

export function formatMgrs(latlng, accuracy = 5) {
  if (!latlng || !Number.isFinite(latlng.lat) || !Number.isFinite(latlng.lng)) return null;
  try {
    return forward([latlng.lng, latlng.lat], accuracy);
  } catch (error) {
    return null;
  }
}

export function parseMgrs(input) {
  if (!input || typeof input !== 'string') return null;
  const normalized = input.trim().replace(/\s+/g, '');
  if (!normalized) return null;

  try {
    const [lng, lat] = toPoint(normalized);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  } catch (error) {
    return null;
  }
}
