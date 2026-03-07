// Line-of-sight (LoS) profile utilities.
import { decodeElevationMeters } from './elevation';

export function sampleElevationImageData(imageData, x, y) {
  const { width, height, data } = imageData;
  const ix = Math.max(0, Math.min(width - 1, Math.round(x)));
  const iy = Math.max(0, Math.min(height - 1, Math.round(y)));
  const i = (iy * width + ix) * 4;
  return decodeElevationMeters(data[i], data[i + 1], data[i + 2]);
}

export function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Simple lat/lng interpolation (good enough for ~100km scale).
export function lerpLatLng(a, b, t) {
  return {
    lat: lerp(a.lat, b.lat, t),
    lng: lerp(a.lng, b.lng, t),
  };
}

export function wavelengthMeters(freqMHz) {
  if (!(freqMHz > 0)) return 0;
  return 299792458 / (freqMHz * 1e6);
}

export function fresnelRadiusMeters(freqMHz, d1Meters, d2Meters) {
  if (!(freqMHz > 0) || !(d1Meters >= 0) || !(d2Meters >= 0) || d1Meters + d2Meters <= 0) return 0;
  const lambda = wavelengthMeters(freqMHz);
  return Math.sqrt((lambda * d1Meters * d2Meters) / (d1Meters + d2Meters));
}

// Returns { blocked: boolean, blockedAtIndex?: number }
export function computeLosBlock(profile, aElev, bElev) {
  if (!profile?.length) return { blocked: false };
  const total = profile[profile.length - 1].dist;
  if (total <= 0) return { blocked: false };

  for (let i = 0; i < profile.length; i++) {
    const d = profile[i].dist;
    const t = d / total;
    const losElev = lerp(aElev, bElev, t);
    if (profile[i].elev > losElev) {
      return { blocked: true, blockedAtIndex: i };
    }
  }
  return { blocked: false };
}

// Returns { obstructed: boolean, obstructedAtIndex?: number, maxRadius: number }
export function computeFresnelClearance(profile, aElev, bElev, freqMHz, clearanceRatio = 0.6) {
  if (!profile?.length || !(freqMHz > 0)) return { obstructed: false, maxRadius: 0 };
  const total = profile[profile.length - 1].dist;
  if (!(total > 0)) return { obstructed: false, maxRadius: 0 };

  let maxRadius = 0;
  for (let i = 0; i < profile.length; i++) {
    const p = profile[i];
    const d1 = p.dist;
    const d2 = total - d1;
    const r = fresnelRadiusMeters(freqMHz, d1, d2);
    if (r > maxRadius) maxRadius = r;
    const losElev = lerp(aElev, bElev, p.t);
    const lowerClearance = losElev - r * clearanceRatio;
    if (p.elev > lowerClearance) {
      return { obstructed: true, obstructedAtIndex: i, maxRadius };
    }
  }
  return { obstructed: false, maxRadius };
}
