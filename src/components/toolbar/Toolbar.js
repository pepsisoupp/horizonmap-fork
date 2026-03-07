import React, { useContext } from 'react';
import MainContext from '../../contexts/MainContext';
import './Toolbar.css';
import MarkerMove from './MakrerMove';
import RadiusSlider from './RadiusSlider';
import DisplayPosition from './DisplayPosition';
import Constants from '../../helpers/constants';
import ToggleOverlay from './ToggleOverlay';
import ToggleHeatmap from './ToggleHeatmap';
import HeatmapOpacitySlider from './HeatmapOpacitySlider';
import QualitySlider from './QualitySlider';
import RaysSlider from './RaysSlider';
import HeightOffsetSlider from './HeightOffsetSlider';
import ProgressIndicator from './ProgressIndicator';
import ToggleCurvature from './ToggleCurvature';
import ToggleMode from './ToggleMode';
import HeightSourceNotice from './HeightSourceNotice';
import BasemapSelector from './BasemapSelector';
import MgrsGoTo from './MgrsGoTo';
import LinkBudgetPanel from './LinkBudgetPanel';

export default function Toolbar({ open, onClose }) {
    const { map, mode } = useContext(MainContext);

    return (
        <div className={`toolbar-shell ${open ? 'open' : ''}`}>
            <button type='button' className={`toolbar-backdrop ${open ? 'open' : ''}`} onClick={onClose} aria-label='Close menu' />
            <aside className={`toolbar-panel ${open ? 'open' : ''}`}>
                <div className='toolbar-panel-header'>
                    <div>
                        <div className='toolbar-panel-title'>Menu</div>
                        <div className='toolbar-panel-subtitle'>Map, analysis and RF controls</div>
                    </div>
                    <button type='button' className='toolbar-close' onClick={onClose}>×</button>
                </div>
                {!map && <div className='toolbar-loading'>Loading map…</div>}
                {map && <div className='toolbar'>
                <HeightSourceNotice />
                <ToggleMode />
                <BasemapSelector />
                <MgrsGoTo />
                {mode === 'horizon' && <MarkerMove />}
                {mode === 'horizon' && <RadiusSlider />}
                <QualitySlider />
                {mode === 'horizon' && <RaysSlider />}
                {mode === 'horizon' && <HeightOffsetSlider />}
                {mode === 'horizon' && <ToggleCurvature />}
                { Constants.debug.displayPosition && <DisplayPosition /> }
                {mode === 'horizon' && <ToggleOverlay />}
                {mode === 'horizon' && <ToggleHeatmap />}
                {mode === 'horizon' && <HeatmapOpacitySlider />}
                <LinkBudgetPanel />
            </div>}
            </aside>
            <div className='progress-indicator-cont'>
                <ProgressIndicator />
            </div>
        </div>
    );
}