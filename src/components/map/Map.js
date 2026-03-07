import { useContext, useMemo } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import Constants from '../../helpers/constants';
import DraggableMarker from './DraggableMarker';
import RadiusPreview from './RadiusPreview';
import MainContext from '../../contexts/MainContext';
import './Map.css';
import HorizonOverlay from '../horizon/HorizonOverlay';
import HeatmapOverlay from '../horizon/HeatmapOverlay';
import MouseElevationTooltip from './MouseElevationTooltip';
import LosLayer from './LosLayer';
import LosPanel from '../los/LosPanel';
import HeatmapLegend from './HeatmapLegend';
import SearchPinMarker from './SearchPinMarker';
import HorizonClickMove from './HorizonClickMove';

export default function Map(props) {
    const { setMap } = props;
    const { mode, basemap, showOverlay, showHeatmap, horizonData, heatmapData } = useContext(MainContext);

    const basemapConfig = Constants.basemap.options[basemap] || Constants.basemap.options[Constants.basemap.default];

    const displayMap = useMemo(
        () => (
            <MapContainer 
                center={Constants.startPos} 
                zoom={Constants.startZoom} 
                scrollWheelZoom={true} 
                style={{ height: '100%' }} 
                ref={setMap}
            >
                <TileLayer
                    key={basemap}
                    attribution={basemapConfig.attribution}
                    url={basemapConfig.url}
                    subdomains={basemapConfig.subdomains}
                    maxNativeZoom={basemapConfig.maxNativeZoom}
                    maxZoom={basemapConfig.maxZoom}
                />
                { showHeatmap && heatmapData && <HeatmapOverlay />}
                { showOverlay && horizonData && <HorizonOverlay />}
                <MouseElevationTooltip />
                <SearchPinMarker />
                {mode === 'horizon' && <HorizonClickMove />}
                {mode === 'horizon' && <DraggableMarker />}
                {mode === 'los' && <LosLayer />}
            </MapContainer>
        ),
        [setMap, basemap, showOverlay, showHeatmap, horizonData, heatmapData, mode, basemapConfig]
    );

    return (
        <div className='map'>
            {displayMap}   
            {mode === 'horizon' && <RadiusPreview />}
            <HeatmapLegend />
            <LosPanel />
        </div>
    )
}