import Constants from '../../helpers/constants';

export default function HeightSourceNotice() {
  if (Constants.heightmap.source === 'mapbox') {
    return (
      <div className='height-source-notice'>
        Mapbox 고도 데이터
      </div>
    );
  }

  return (
    <div className='height-source-notice warning'>
      Terrarium 고도 데이터
    </div>
  );
}
