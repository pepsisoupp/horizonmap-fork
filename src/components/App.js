import { useState } from 'react';
import Map from './map/Map';
import Toolbar from './toolbar/Toolbar';
import TopBar from './ui/TopBar';
import MainContext from '../contexts/MainContext';
import './App.css';
import Constants from '../helpers/constants';
import HorizonManager from './horizon/HorizonManager';
import LosManager from './los/LosManager';

function App() {
  const [map, setMap] = useState(null);
  const [mode, setMode] = useState('horizon');
  const [basemap, setBasemap] = useState(Constants.basemap.default);
  const [markerPos, setMarkerPos] = useState(Constants.marker.startPos);
  const [radius, setRadius] = useState(Constants.marker.defaultRadius);
  const [heightmapZoom, setHeightmapZoom] = useState(Constants.heightmap.defaultZoom);
  const [rays, setRays] = useState(Constants.horizon.defaultRays);
  const [heightOffset, setHeightOffset] = useState(Constants.horizon.defaultHeightOffset);
  const [includeCurvature, setIncludeCurvature] = useState(Constants.horizon.defaultIncludeCurvature);
  const [showOverlay, setShowOverlay] = useState(true);
  const [horizonData, setHorizonData] = useState(null);
  const [heatmapData, setHeatmapData] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(Constants.heatmap.defaultShow);
  const [heatmapOpacity, setHeatmapOpacity] = useState(Constants.heatmap.defaultOpacity);
  const [heightmapInfo, setHeightmapInfo] = useState(null);
  const [inProgress, setInProgress] = useState(0);

  // LoS mode state
  const [losA, setLosA] = useState(null);
  const [losB, setLosB] = useState(null);
  const [antennaA, setAntennaA] = useState(Constants.los.defaultAntennaA);
  const [antennaB, setAntennaB] = useState(Constants.los.defaultAntennaB);
  const [losProfile, setLosProfile] = useState(null);
  const [losProbePos, setLosProbePos] = useState(null);
  const [losSelectedIndex, setLosSelectedIndex] = useState(null);
  const [searchPinPos, setSearchPinPos] = useState(null);
  const [losFrequencyMHz, setLosFrequencyMHz] = useState(100);
  const [txPower, setTxPower] = useState(30);
  const [txGain, setTxGain] = useState(12);
  const [rxGain, setRxGain] = useState(12);
  const [otherLoss, setOtherLoss] = useState(2);
  const [rxSensitivity, setRxSensitivity] = useState(-85);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <MainContext.Provider value={{ 
      map, 
      mode, setMode,
      basemap, setBasemap,
      markerPos, setMarkerPos, 
      radius, setRadius, 
      showOverlay, setShowOverlay,
      heightmapZoom, setHeightmapZoom,
      rays, setRays,
      horizonData, setHorizonData,
      heatmapData, setHeatmapData,
      showHeatmap, setShowHeatmap,
      heatmapOpacity, setHeatmapOpacity,
      heightmapInfo, setHeightmapInfo,
      heightOffset, setHeightOffset,
      includeCurvature, setIncludeCurvature,
      inProgress, setInProgress,

      // LoS
      losA, setLosA,
      losB, setLosB,
      antennaA, setAntennaA,
      antennaB, setAntennaB,
      losProfile, setLosProfile,
      losProbePos, setLosProbePos,
      losSelectedIndex, setLosSelectedIndex,
      searchPinPos, setSearchPinPos,
      losFrequencyMHz, setLosFrequencyMHz,
      txPower, setTxPower,
      txGain, setTxGain,
      rxGain, setRxGain,
      otherLoss, setOtherLoss,
      rxSensitivity, setRxSensitivity,
    }}>
      <div className="App">
        <HorizonManager />
        <LosManager />
        <TopBar menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((v) => !v)} />
        <Toolbar open={menuOpen} onClose={() => setMenuOpen(false)} />
        <Map setMap={setMap} />
      </div>
    </MainContext.Provider>
  );
}

export default App;
