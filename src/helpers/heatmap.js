import { decodeElevationMeters } from './elevation';

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function mixColor(a, b, t) {
  return [
    Math.round(lerp(a[0], b[0], t)),
    Math.round(lerp(a[1], b[1], t)),
    Math.round(lerp(a[2], b[2], t)),
  ];
}

const ramp = [
  { stop: 0.0, color: [49, 54, 149] },
  { stop: 0.16, color: [69, 117, 180] },
  { stop: 0.33, color: [116, 173, 209] },
  { stop: 0.5, color: [171, 217, 233] },
  { stop: 0.63, color: [255, 255, 191] },
  { stop: 0.76, color: [253, 174, 97] },
  { stop: 0.88, color: [244, 109, 67] },
  { stop: 1.0, color: [165, 0, 38] },
];

function getRampColor(t) {
  const value = clamp01(t);
  for (let i = 1; i < ramp.length; i += 1) {
    if (value <= ramp[i].stop) {
      const prev = ramp[i - 1];
      const next = ramp[i];
      const localT = (value - prev.stop) / Math.max(1e-6, next.stop - prev.stop);
      return mixColor(prev.color, next.color, localT);
    }
  }
  return ramp[ramp.length - 1].color;
}

function getElevationStats(imageData) {
  const { data } = imageData;
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  for (let i = 0; i < data.length; i += 4) {
    const elev = decodeElevationMeters(data[i], data[i + 1], data[i + 2]);
    if (!Number.isFinite(elev)) continue;
    if (elev < min) min = elev;
    if (elev > max) max = elev;
  }

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    min = 0;
    max = 1;
  }

  if (max - min < 1) {
    max = min + 1;
  }

  return { min, max };
}

function getHillshade(imageData, x, y) {
  const { width, height, data } = imageData;
  const sample = (sx, sy) => {
    const cx = Math.max(0, Math.min(width - 1, sx));
    const cy = Math.max(0, Math.min(height - 1, sy));
    const i = (cy * width + cx) * 4;
    return decodeElevationMeters(data[i], data[i + 1], data[i + 2]);
  };

  const dzdx = (sample(x + 1, y) - sample(x - 1, y)) * 0.5;
  const dzdy = (sample(x, y + 1) - sample(x, y - 1)) * 0.5;
  const nx = -dzdx;
  const ny = -dzdy;
  const nz = 32;
  const len = Math.hypot(nx, ny, nz) || 1;
  const lx = -0.6;
  const ly = -0.6;
  const lz = 1.0;
  const llen = Math.hypot(lx, ly, lz) || 1;
  const dot = (nx / len) * (lx / llen) + (ny / len) * (ly / llen) + (nz / len) * (lz / llen);
  return clamp01((dot + 1) * 0.5);
}

function buildHeatmapCanvas(imageData, opacity = 0.45) {
  const { width, height, data } = imageData;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const out = ctx.createImageData(width, height);
  const stats = getElevationStats(imageData);
  const range = stats.max - stats.min;
  const alpha = Math.round(clamp01(opacity) * 255);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      const elev = decodeElevationMeters(data[i], data[i + 1], data[i + 2]);
      const t = (elev - stats.min) / range;
      const [r, g, b] = getRampColor(t);
      const shade = 0.78 + getHillshade(imageData, x, y) * 0.35;

      out.data[i] = Math.max(0, Math.min(255, Math.round(r * shade)));
      out.data[i + 1] = Math.max(0, Math.min(255, Math.round(g * shade)));
      out.data[i + 2] = Math.max(0, Math.min(255, Math.round(b * shade)));
      out.data[i + 3] = alpha;
    }
  }

  ctx.putImageData(out, 0, 0);
  return { canvas, stats };
}

function getDataUrlFromCanvas(canvas) {
  return canvas.toDataURL('image/png');
}

const Heatmap = {
  decodeElevationMeters,
  getElevationStats,
  buildHeatmapCanvas,
  getDataUrlFromCanvas,
};

export default Heatmap;
