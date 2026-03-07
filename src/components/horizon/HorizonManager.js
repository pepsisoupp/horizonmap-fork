import { useRef, useContext, useEffect, useCallback, useState } from "react";
import MainContext from "../../contexts/MainContext";
import Heightmap from "../../helpers/heightmap";
import MapHelper from "../../helpers/mapHelper";
import Horizon from "../../helpers/horizon";
import Heatmap from "../../helpers/heatmap";

const createWorker = () => new Worker(new URL("../../workers/horizonWorker.js", import.meta.url), { type: "module" });

export default function HorizonManager() {
    const {
        mode,
        map,
        markerPos,
        radius,
        setHorizonData,
        setHeatmapData,
        heatmapOpacity,
        heightmapZoom,
        heightOffset,
        rays,
        includeCurvature,
        setInProgress,
        setHeightmapInfo,
    } = useContext(MainContext);
    const horizonWorkerRef = useRef(null);
    const [firstStageData, setFirstStageData] = useState(null);

    const safeSetInProgress = useCallback((stage) => {
        if (stage <= 0) return setInProgress(stage);

        let alreadyInProgress = false;
        setInProgress((old) => {
            alreadyInProgress = old >= stage;
            return stage;
        });
        return alreadyInProgress;
    }, [setInProgress]);

    const loadHeightmaps = useCallback(async () => {
        if (!map) return;
        if (mode !== 'horizon') return;
        if (safeSetInProgress(1)) return;

        const circleBounds = MapHelper.getCircleBounds(markerPos.lat, markerPos.lng, radius);
        const pixelBounds = MapHelper.latLngBoundsToPixel(circleBounds, heightmapZoom, map);
        const tileBounds = MapHelper.pixelBoundsToTile(pixelBounds);
        const tiles = await Heightmap.loadTilesInBounds(tileBounds, heightmapZoom);
        const combinedTiles = Heightmap.combineTiles(tiles, tileBounds);

        setHeightmapInfo({
            imageData: combinedTiles,
            circleBounds,
            pixelBounds,
            zoom: heightmapZoom,
        });

        const { canvas, stats } = Heatmap.buildHeatmapCanvas(combinedTiles, heatmapOpacity);
        setHeatmapData({
            dataUrl: Heatmap.getDataUrlFromCanvas(canvas),
            circleBounds,
            minElevation: Math.round(stats.min),
            maxElevation: Math.round(stats.max),
        });

        setFirstStageData({ combinedTiles, circleBounds, radius });
    }, [map, mode, markerPos, radius, heightmapZoom, heatmapOpacity, safeSetInProgress, setHeightmapInfo, setHeatmapData]);

    const generateHorizon = useCallback(() => {
        if (!firstStageData || !firstStageData.combinedTiles) return;
        if (mode !== 'horizon') return;
        if (safeSetInProgress(2)) return;

        if (!horizonWorkerRef.current) {
            horizonWorkerRef.current = createWorker();
        }

        horizonWorkerRef.current.onmessage = (event) => {
            setHorizonData({
                dataUrl: Horizon.getDataUrlFromImageData(event.data),
                circleBounds: firstStageData.circleBounds,
            });
            safeSetInProgress(0);
        };

        horizonWorkerRef.current.postMessage({
            combinedTiles: firstStageData.combinedTiles,
            heightOffset,
            rays,
            radius: firstStageData.radius,
            includeCurvature,
        });
    }, [firstStageData, mode, heightOffset, rays, includeCurvature, setHorizonData, safeSetInProgress]);

    useEffect(() => {
        loadHeightmaps();
    }, [loadHeightmaps]);

    useEffect(() => {
        generateHorizon();

        return () => {
            horizonWorkerRef.current?.terminate();
            horizonWorkerRef.current = null;
        };
    }, [generateHorizon]);

    return null;
}
