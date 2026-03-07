const Constants = {
    startPos: [36.0, 127.8],
    startZoom: 7,
    basemap: {
        default: 'osm',
        options: {
            osm: {
                label: 'OpenStreetMap',
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                subdomains: ['a', 'b', 'c'],
                maxNativeZoom: 19,
                maxZoom: 22,
            },
            googleHybrid: {
                label: 'Google Hybrid',
                url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
                attribution: '&copy; Google',
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                maxNativeZoom: 20,
                maxZoom: 22,
            },
        },
    },
    marker: {
        startPos: {lat: 36.0, lng: 127.8},
        minRadius: 10,
        maxRadius: 50,
        defaultRadius: 10,
        radiusStep: 10,
        previewColor: '#4488ff',
        previewWeight: 2,
        previewOpacity: 0.2,
    },
    debug: {
        displayPosition: false,
    },
    heightmap: {
        source: 'terrarium',
        sourceLabel: 'Terrarium',
        url: (x, y, z) => `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`,
        tileSize: 256,
        minZoom: 10,
        maxZoom: 14,
        defaultZoom: 12,
    },
    horizon: {
        minRays: 360 * 2,
        maxRays: 360 * 8,
        defaultRays: 360 * 4,
        raysStep: 360,
        minHeightOffset: 0,
        maxHeightOffset: 100,
        defaultHeightOffset: 2,
        overlayAlpha: 0.7,
        defaultIncludeCurvature: true,
    },
    heatmap: {
        defaultShow: true,
        defaultOpacity: 0.45,
        minOpacity: 0.1,
        maxOpacity: 0.9,
        opacityStep: 0.05,
    },
    los: {
        defaultAntennaA: 1,
        defaultAntennaB: 1,
        minAntenna: 0,
        maxAntenna: 200,
        antennaStep: 0.5,
        minSampleStep: 30,
        maxSampleStep: 250,
        boundsPadMeters: 1500,
    }
};

export default Constants;
