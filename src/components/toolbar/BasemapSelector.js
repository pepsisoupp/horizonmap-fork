import { useContext } from 'react';
import MainContext from '../../contexts/MainContext';

const OPTIONS = [
  { value: 'osm', label: 'OSM' },
  { value: 'googleHybrid', label: '구글 하이브리드 지도' },
];

export default function BasemapSelector() {
  const { basemap, setBasemap } = useContext(MainContext);

  return (
    <div className='toolbar-item'>
      <span className='toolbar-label'>Basemap</span>
      <div className='toolbar-toggle-group' role='group' aria-label='베이스맵 선택'>
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type='button'
            className={`toolbar-btn ${basemap === option.value ? 'active' : ''}`}
            onClick={() => setBasemap(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
