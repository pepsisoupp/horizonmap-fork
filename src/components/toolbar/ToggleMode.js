import { useContext } from "react";
import MainContext from "../../contexts/MainContext";
import "./Toolbar.css";

export default function ToggleMode() {
  const { mode, setMode, setHorizonData } = useContext(MainContext);

  return (
    <div className="toolbar-item">
      <div className="toolbar-label">Mode</div>
      <div style={{ display: "flex", gap: 6 }}>
        <button
          className={`toolbar-btn ${mode === "horizon" ? "active" : ""}`}
          onClick={() => {
            setMode("horizon");
          }}
        >
          Horizon
        </button>
        <button
          className={`toolbar-btn ${mode === "los" ? "active" : ""}`}
          onClick={() => {
            setHorizonData(null);
            setMode("los");
          }}
        >
          LoS
        </button>
      </div>
    </div>
  );
}
