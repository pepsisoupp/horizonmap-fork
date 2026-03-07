import Constants from './constants';

export function decodeElevationMeters(r, g, b) {
  return (r * 256 + g + b / 256) - 32768;
}

export function decodeElevationFromColor(color) {
  const r = Math.round((color.r ?? 0) * 255);
  const g = Math.round((color.g ?? 0) * 255);
  const b = Math.round((color.b ?? 0) * 255);
  return decodeElevationMeters(r, g, b);
}

export function getHeightSourceLabel() {
  return Constants.heightmap.sourceLabel;
}

export function hasMapboxToken() {
  return false;
}
