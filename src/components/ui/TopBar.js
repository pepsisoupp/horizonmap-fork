import React from 'react';
import './TopBar.css';

export default function TopBar({ menuOpen, onToggleMenu }) {
  return (
    <div className="topbar">
      <button
        type="button"
        className={`hamburger ${menuOpen ? 'active' : ''}`}
        onClick={onToggleMenu}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>
      <div className="topbar-title-wrap">
        <div className="topbar-title">RF 유틸리티</div>
        <div className="topbar-subtitle"> </div>
      </div>
    </div>
  );
}
