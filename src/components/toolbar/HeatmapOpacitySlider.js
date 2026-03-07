import { useContext } from 'react';
import MainContext from '../../contexts/MainContext';
import Constants from '../../helpers/constants';
import CustomSlider from '../inputs/CustomSlider';

export default function HeatmapOpacitySlider() {
    const { heatmapOpacity, setHeatmapOpacity, mode, inProgress } = useContext(MainContext);

    if (mode !== 'horizon') return null;

    return (
        <CustomSlider
            displayName='히트맵 투명도'
            className='heatmap-opacity-slider'
            suffix=''
            value={heatmapOpacity}
            setValue={(value) => setHeatmapOpacity(Number(value))}
            disabled={inProgress !== 0}
            min={Constants.heatmap.minOpacity}
            max={Constants.heatmap.maxOpacity}
            step={Constants.heatmap.opacityStep}
        />
    );
}
