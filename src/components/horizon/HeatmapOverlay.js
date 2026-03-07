import L from "leaflet";
import { useEffect, useContext, useMemo } from "react";
import { useMap } from "react-leaflet";
import MainContext from "../../contexts/MainContext";

export default function HeatmapOverlay() {
    const { heatmapData } = useContext(MainContext);
    const map = useMap();

    const overlay = useMemo(() => {
        if (!map || !heatmapData) return null;

        return L.imageOverlay(heatmapData.dataUrl, [
            [heatmapData.circleBounds.north, heatmapData.circleBounds.west],
            [heatmapData.circleBounds.south, heatmapData.circleBounds.east]
        ], {
            zIndex: 200,
            opacity: 1,
            interactive: false,
        });
    }, [map, heatmapData]);

    useEffect(() => {
        if (overlay) {
            overlay.addTo(map);
        }

        return () => {
            if (overlay) {
                overlay.remove();
            }
        };
    }, [overlay, map]);

    return null;
}
