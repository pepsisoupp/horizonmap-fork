import { useContext } from 'react';
import MainContext from '../../contexts/MainContext';
import { getHeightSourceLabel } from '../../helpers/elevation';

export default function HeatmapLegend() {
  const { heatmapData, showHeatmap, mode } = useContext(MainContext);

  if (mode !== 'horizon' || !showHeatmap || !heatmapData) {
    return null;
  }

  return (
    <div className='heatmap-legend'>
      <div className='heatmap-legend-title'>고도 히트맵</div>
      <div className='heatmap-legend-source'>{getHeightSourceLabel()}</div>
      <div className='heatmap-legend-gradient' />
      <div className='heatmap-legend-scale'>
        <span>{heatmapData.minElevation} m</span>
        <span>{heatmapData.maxElevation} m</span>
      </div>
    </div>
  );
}
