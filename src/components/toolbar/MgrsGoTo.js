import { useContext, useState } from 'react';
import MainContext from '../../contexts/MainContext';
import { parseMgrs } from '../../helpers/mgrs';

export default function MgrsGoTo() {
  const { map, setSearchPinPos } = useContext(MainContext);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const goToMgrs = () => {
    const latlng = parseMgrs(value);
    if (!latlng) {
      setError('잘못된 MGRS 좌표');
      return;
    }

    setError('');
    setSearchPinPos(latlng);
    if (map) {
      const nextZoom = Math.max(map.getZoom?.() || 0, 15);
      map.flyTo(latlng, nextZoom, { duration: 0.8 });
    }
  };

  return (
    <div className='toolbar-item toolbar-item-stack'>
      <label className='toolbar-label' htmlFor='mgrs-input'>MGRS</label>
      <div className='toolbar-inline-field'>
        <input
          id='mgrs-input'
          className='toolbar-input toolbar-input-wide'
          type='text'
          placeholder='52SDH8572719195'
          value={value}
          onChange={(e) => {
            setValue(e.target.value.toUpperCase());
            if (error) setError('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') goToMgrs();
          }}
        />
        <button className='toolbar-btn' type='button' onClick={goToMgrs}>이동</button>
      </div>
      {error ? <div className='toolbar-error'>{error}</div> : null}
    </div>
  );
}
