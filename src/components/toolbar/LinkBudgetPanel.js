import React, { useContext, useMemo } from 'react';
import MainContext from '../../contexts/MainContext';
import { wavelengthMeters } from '../../helpers/los';

const presets = [
  { label: 'AM', value: 1 },
  { label: 'FM', value: 100 },
  { label: 'Airband', value: 243 },
  { label: 'VHF', value: 150 },
  { label: 'UHF', value: 450 },
  { label: '2.4G', value: 2400 },
  { label: '5.8G', value: 5800 },
  { label: '직접 입력', value: null },
];

function fspl(distanceKm, freqMHz) {
  if (!(distanceKm > 0) || !(freqMHz > 0)) return 0;
  return 32.44 + 20 * Math.log10(distanceKm) + 20 * Math.log10(freqMHz);
}

export default function LinkBudgetPanel() {
  const {
    losProfile,
    losFrequencyMHz,
    setLosFrequencyMHz,
    txPower,
    setTxPower,
    txGain,
    setTxGain,
    rxGain,
    setRxGain,
    otherLoss,
    setOtherLoss,
    rxSensitivity,
    setRxSensitivity,
  } = useContext(MainContext);

  const distanceKm = useMemo(() => (losProfile?.totalMeters || 0) / 1000, [losProfile]);
  const wavelength = wavelengthMeters(losFrequencyMHz || 0);
  const pathLoss = fspl(distanceKm, losFrequencyMHz || 0);
  const rxPower = txPower + txGain + rxGain - pathLoss - otherLoss;
  const margin = rxPower - rxSensitivity;

  const preset = useMemo(() => presets.find((p) => p.value === losFrequencyMHz)?.label || 'Custom', [losFrequencyMHz]);
  const status = margin >= 20 ? 'Excellent' : margin >= 10 ? 'Good' : margin >= 0 ? 'Marginal' : 'Fail';

  const onPresetChange = (e) => {
    const next = e.target.value;
    const found = presets.find((p) => p.label === next);
    if (found?.value) setLosFrequencyMHz(found.value);
  };

  return (
    <div className="toolbar-section-card toolbar-section-card-link">
      <div className="toolbar-section-title">링크 버짓</div>
      <div className="toolbar-grid-2">
        <label className="toolbar-field">
          <span className="toolbar-label">프리셋</span>
          <select className="toolbar-input" value={preset} onChange={onPresetChange}>
            {presets.map((p) => (
              <option key={p.label} value={p.label}>{p.label}</option>
            ))}
          </select>
        </label>
        <label className="toolbar-field">
          <span className="toolbar-label">주파수 (MHz)</span>
          <input className="toolbar-input" type="number" value={losFrequencyMHz} onChange={(e) => setLosFrequencyMHz(Number(e.target.value))} />
        </label>
        <label className="toolbar-field">
          <span className="toolbar-label">TX 파워 (dBm)</span>
          <input className="toolbar-input" type="number" value={txPower} onChange={(e) => setTxPower(Number(e.target.value))} />
        </label>
        <label className="toolbar-field">
          <span className="toolbar-label">TX 이득 (dBi)</span>
          <input className="toolbar-input" type="number" value={txGain} onChange={(e) => setTxGain(Number(e.target.value))} />
        </label>
        <label className="toolbar-field">
          <span className="toolbar-label">RX 이득 (dBi)</span>
          <input className="toolbar-input" type="number" value={rxGain} onChange={(e) => setRxGain(Number(e.target.value))} />
        </label>
        <label className="toolbar-field">
          <span className="toolbar-label">기타 손실 (dB)</span>
          <input className="toolbar-input" type="number" value={otherLoss} onChange={(e) => setOtherLoss(Number(e.target.value))} />
        </label>
        <label className="toolbar-field toolbar-field-full">
          <span className="toolbar-label">RX 감도 (dBm)</span>
          <input className="toolbar-input" type="number" value={rxSensitivity} onChange={(e) => setRxSensitivity(Number(e.target.value))} />
        </label>
      </div>
      <div className="toolbar-metrics">
        <div><strong>거리</strong><span>{distanceKm > 0 ? `${distanceKm.toFixed(2)} km` : 'A,B 지점을 LoS 모드에서 지정하세요'}</span></div>
        <div><strong>파장</strong><span>{wavelength > 0 ? `${wavelength.toFixed(2)} m` : '-'}</span></div>
        <div><strong>자유공간 경로 손실</strong><span>{distanceKm > 0 ? `${pathLoss.toFixed(1)} dB` : '-'}</span></div>
        <div><strong>RX 파워</strong><span>{distanceKm > 0 ? `${rxPower.toFixed(1)} dBm` : '-'}</span></div>
        <div><strong>마진</strong><span>{distanceKm > 0 ? `${margin.toFixed(1)} dB` : '-'}</span></div>
        <div><strong>상태</strong><span className={`link-budget-status status-${status.toLowerCase()}`}>{status}</span></div>
      </div>
    </div>
  );
}
