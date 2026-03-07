import { useContext } from 'react';
import MainContext from '../../contexts/MainContext';

export default function ToggleHeatmap() {
    const { showHeatmap, setShowHeatmap, mode, inProgress } = useContext(MainContext);

    if (mode !== 'horizon') return null;

    return (
        <div className='toggle-overlay'>
            <input type='checkbox' id='toggle-heatmap-checkbox' disabled={inProgress !== 0} checked={showHeatmap} onChange={() => setShowHeatmap(!showHeatmap)} />
            <label htmlFor='toggle-heatmap-checkbox'>히트맵 표시</label>
        </div>
    );
}
