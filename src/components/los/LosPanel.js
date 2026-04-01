import { useContext, useMemo, useRef, useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import mouseWheelZoom from 'highcharts/modules/mouse-wheel-zoom';
import MainContext from "../../contexts/MainContext";
import Constants from "../../helpers/constants";
import {
  computeLosBlock,
  computeFresnelClearance,
  fresnelRadiusMeters,
  lerp,
  wavelengthMeters,
} from "../../helpers/los";
import "./LosPanel.css";
import { type } from "@testing-library/user-event/dist/type";
//highchart 마우스 줌 초기화


function metersToKm(m) {
  return m / 1000;
}

const presetOptions = [
  { label: 'AM', value: 1 },
  { label: 'FM', value: 100 },
  { label: 'Airband', value: 125 },
  { label: 'VHF', value: 150 },
  { label: 'UHF', value: 450 },
  { label: '900', value: 915 },
  { label: '2.4G', value: 2400 },
  { label: '5.8G', value: 5800 },
  { label: 'Custom', value: null },
];

export default function LosPanel() {
  const {
    mode,
    losA,
    losB,
    losProfile,
    antennaA,
    antennaB,
    setAntennaA,
    setAntennaB,
    setLosProbePos,
    setLosSelectedIndex,
    setSearchPinPos,
    losFrequencyMHz,
    setLosFrequencyMHz,
  } = useContext(MainContext);

  const chartRef = useRef(null);

  const [open, setOpen] = useState(window.innerWidth > 768);


  const chartData = useMemo(() => {
    if (!losProfile?.profile?.length || !losA || !losB) return null;

    const profile = losProfile.profile;
    const aGround = profile[0].elev;
    const bGround = profile[profile.length - 1].elev;
    const aElev = aGround + Number(antennaA || 0);
    const bElev = bGround + Number(antennaB || 0);

    const blockedInfo = computeLosBlock(profile, aElev, bElev);
    const fresnelInfo = computeFresnelClearance(profile, aElev, bElev, losFrequencyMHz || 0, 0.6);

    const area = profile.map((p) => [metersToKm(p.dist), p.elev]);
    const losLine = profile.map((p) => {
      const y = lerp(aElev, bElev, p.t);
      return [metersToKm(p.dist), y];
    });

    const fresnelUpper = profile.map((p) => {
      const r = fresnelRadiusMeters(losFrequencyMHz || 0, p.dist, losProfile.totalMeters - p.dist);
      const base = lerp(aElev, bElev, p.t);
      return [metersToKm(p.dist), base + r];
    });
    const fresnelLower = profile.map((p) => {
      const r = fresnelRadiusMeters(losFrequencyMHz || 0, p.dist, losProfile.totalMeters - p.dist);
      const base = lerp(aElev, bElev, p.t);
      return [metersToKm(p.dist), base - r];
    });
    const fresnel60Lower = profile.map((p) => {
      const r = fresnelRadiusMeters(losFrequencyMHz || 0, p.dist, losProfile.totalMeters - p.dist) * 0.6;
      const base = lerp(aElev, bElev, p.t);
      return [metersToKm(p.dist), base - r];
    });

    const status = blockedInfo.blocked
      ? '지형에 의해 차폐됨'
      : fresnelInfo.obstructed
        ? '프레스넬 영역 60% 이상 차폐'
        : '원활';

    return {
      aGround,
      bGround,
      aElev,
      bElev,
      blocked: blockedInfo.blocked,
      fresnelObstructed: fresnelInfo.obstructed,
      area,
      losLine,
      fresnelUpper,
      fresnelLower,
      fresnel60Lower,
      totalKm: metersToKm(losProfile.totalMeters),
      totalMeters: losProfile.totalMeters,
      profile,
      status,
      wavelength: wavelengthMeters(losFrequencyMHz || 0),
      maxFresnelRadius: fresnelInfo.maxRadius || 0,
    };
  }, [losProfile, losA, losB, antennaA, antennaB, losFrequencyMHz]);

  const options = useMemo(() => {
    if (!chartData) return null;

    const onPointHover = function () {
      const idx = this.index;
      const p = chartData.profile[idx];
      if (!p) return;
      setLosProbePos(p.latlng);
      setLosSelectedIndex(null);
    };

    const onPointClick = function () {
      const idx = this.index;
      const p = chartData.profile[idx];
      if (!p) return;
      setLosProbePos(p.latlng);
      setSearchPinPos(p.latlng);
      setLosSelectedIndex(idx);
    };

    

    return {
      chart: {
        height: 390,
        animation: true,
       zooming: {
            mouseWheel: {
              enabled: true,
              type: 'xy',
              showResetButton: 'true'
            },
            type: 'xy'
        },
        panning: {
            enabled: true,
            type: 'xy'
        },
        panKey: 'shift'
      },
      title: { text: '지형 분석 결과' },
      subtitle: {
        text: `거리: ${chartData.totalKm.toFixed(2)} km · 주파수: ${Number(losFrequencyMHz || 0).toFixed(2)} MHz · 상태: ${chartData.status}`,
      },
      credits: { enabled: false },
      legend: { enabled: true },
      xAxis: {
        title: { text: '거리 (km)' },
      },
      yAxis: {
        title: { text: '고도 (m)' },
      },
      tooltip: {
        shared: true,
        formatter: function () {
          const idx = this.points?.find((pt) => pt.series.name === 'Terrain')?.point?.index;
          const p = Number.isFinite(idx) ? chartData.profile[idx] : null;
          const elev = p ? p.elev : null;
          const fresnel = p ? fresnelRadiusMeters(losFrequencyMHz || 0, p.dist, chartData.totalMeters - p.dist) : null;
          return [
            `거리: ${this.x.toFixed(2)} km`,
            `고도: ${elev?.toFixed?.(1) ?? '-'} m`,
            `프레스넬 반지름: ${fresnel?.toFixed?.(1) ?? '-'} m`,
          ].join('<br/>');
        },
      },
      plotOptions: {
        series: {
          animation: false,
          states: { inactive: { opacity: 1 } },
        },
        area: {
          marker: { enabled: false },
          enableMouseTracking: true,
          point: {
            events: {
              mouseOver: onPointHover,
              click: onPointClick,
            },
          },
        },
        line: {
          marker: { enabled: false },
        },
      },
      series: [
        {
          type: 'area',
          name: 'Terrain',
          data: chartData.area,
          color: 'rgba(120,120,120,0.55)',
          lineColor: 'rgba(80,80,80,0.9)',
          lineWidth: 1,
        },
        {
          type: 'line',
          name: 'LoS',
          data: chartData.losLine,
          color: chartData.blocked ? 'rgba(220,0,0,0.95)' : chartData.fresnelObstructed ? 'rgba(214,158,46,0.95)' : 'rgba(0,170,0,0.95)',
          lineWidth: 2.5,
          enableMouseTracking: false,
        },
        {
          type: 'line',
          name: '프레스넬 +100%',
          data: chartData.fresnelUpper,
          color: 'rgba(30,107,255,0.7)',
          lineWidth: 1,
          dashStyle: 'ShortDot',
          enableMouseTracking: false,
        },
        {
          type: 'line',
          name: '프레스넬 -100%',
          data: chartData.fresnelLower,
          color: 'rgba(30,107,255,0.7)',
          lineWidth: 1,
          dashStyle: 'ShortDot',
          enableMouseTracking: false,
        },
        {
          type: 'line',
          name: '프레스넬 60%',
          data: chartData.fresnel60Lower,
          color: 'rgba(214,158,46,0.9)',
          lineWidth: 1.5,
          dashStyle: 'ShortDash',
          enableMouseTracking: false,
        },
      ],
    };
  }, [chartData, losFrequencyMHz, setLosProbePos, setLosSelectedIndex, setSearchPinPos]);

  const preset = useMemo(() => presetOptions.find((p) => p.value === losFrequencyMHz)?.label || 'Custom', [losFrequencyMHz]);

  if (mode !== 'los') return null;
  if (!losA || !losB) {
  return (
    <>
      <button
        className="losToggleBtn"
        onClick={() => setOpen(!open)}
      >
        LOS
      </button>

      <div className={`losPanel ${open ? "open" : ""}`}>
        {!losA || !losB ? (
          <>
            <div className="losPanelHeader">LoS</div>
            <div className="losPanelBody">
              지도에서 지점 A,B를 배치하세요.(Shift+클릭 = A 지점 변경)
            </div>
          </>
        ) : !options ? null : (
          <>
            <div className="losPanelHeader">지형 데이터</div>
            <div className="losPanelBody">
              {/* 기존 내용 그대로 */}
            </div>
          </>
        )}
      </div>
    </>
  );
}

  if (!options) return null;

  return (
    <>
    <button className="losToggleBtn" onClick={() => setOpen(!open)}>
        📡
      </button>

      <div className={`losPanel ${open ? "open" : ""}`}>

      <div className="losPanelHeader">지형 데이터</div>
      <div className="losPanelBody">
        <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />

        <div className="losRow losRowTriple">
          <div className="losControl">
            <span>지점 A (m)</span>
            <input
              type="number"
              step={Constants.los.antennaStep}
              min={Constants.los.minAntenna}
              max={Constants.los.maxAntenna}
              value={antennaA}
              onChange={(e) => setAntennaA(Number(e.target.value))}
            />
          </div>
          <div className="losControl">
            <span>지점 B (m)</span>
            <input
              type="number"
              step={Constants.los.antennaStep}
              min={Constants.los.minAntenna}
              max={Constants.los.maxAntenna}
              value={antennaB}
              onChange={(e) => setAntennaB(Number(e.target.value))}
            />
          </div>
          <div className="losControl">
            <span>프리셋 / MHz</span>
            <div className="losFreqGroup">
              <select value={preset} onChange={(e) => {
                const found = presetOptions.find((p) => p.label === e.target.value);
                if (found?.value) setLosFrequencyMHz(found.value);
              }}>
                {presetOptions.map((p) => <option key={p.label} value={p.label}>{p.label}</option>)}
              </select>
              <input type="number" value={losFrequencyMHz} onChange={(e) => setLosFrequencyMHz(Number(e.target.value))} />
            </div>
          </div>
        </div>
        <div className="losStats">
          <span>파장: {chartData.wavelength > 0 ? `${chartData.wavelength.toFixed(2)} m` : '-'}</span>
          <span>최대 프레스넬 반경: {chartData.maxFresnelRadius > 0 ? `${chartData.maxFresnelRadius.toFixed(1)} m` : '-'}</span>
          <span>상태: {chartData.status}</span>
        </div>
        <div className="losHint">
          그래프 위에 마우스를 올리면 지도에 위치가 표시됩니다.<br></br>
          그래프를 클릭하면 해당 지점에 빨간 핀이 고정됩니다.<br></br>
          마우스 휠로 그래프를 확대 할 수 있습니다.<br></br>
          시프트를 누른 상태로 그래프를 드래그 할 수 있습니다
        </div>
      </div>
    </div>
    </>
  );
}
