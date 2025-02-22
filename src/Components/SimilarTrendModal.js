import React, { useState } from "react";
import "./SimilarTrendModal.css";

const SimilarTrendModal = ({ isOpen, onClose }) => {
  const tabs = [
    "All Companies",
    "Company A",
    "Company B",
    "Company C",
    "Company D",
    "Company E",
    "Company F",
  ];
  const [selectedTab, setSelectedTab] = useState("All Companies");
  const [closing, setClosing] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    // Trigger closing animation
    setClosing(true);
    setTimeout(() => {
      // After animation, call onClose to remove modal
      setClosing(false);
      onClose();
    }, 300);
  };

  const renderContent = () => {
    if (selectedTab === "All Companies") {
      return (
        <>
          <h3>Aggregated Data for All Companies</h3>
          <div className="graphs-row">
            <div className="graph">
              <h4>Average Growth</h4>
              <div className="graph-placeholder">Graph Placeholder</div>
            </div>
            <div className="graph">
              <h4>Average Valuation</h4>
              <div className="graph-placeholder">Graph Placeholder</div>
            </div>
            <div className="graph">
              <h4>Average Revenue (Last 5 Years)</h4>
              <div className="graph-placeholder">Graph Placeholder</div>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <h3>{selectedTab} Data</h3>
          <div className="graphs-row">
            <div className="graph">
              <h4>{selectedTab} Growth</h4>
              <div className="graph-placeholder">Graph Placeholder</div>
            </div>
            <div className="graph">
              <h4>{selectedTab} Valuation</h4>
              <div className="graph-placeholder">Graph Placeholder</div>
            </div>
            <div className="graph">
              <h4>{selectedTab} Revenue</h4>
              <div className="graph-placeholder">Graph Placeholder</div>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <div className={`overlay ${closing ? "closing" : ""}`}>
      <div className={`modal-content ${closing ? "closing" : ""}`}>
        <button className="close-btn" onClick={handleClose}>
          ✕
        </button>
        <h2>Similar Companies</h2>
        {/* Tabs */}
        <div className="tabs">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`tab-item ${selectedTab === tab ? "active" : ""}`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>
        <div className="tab-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default SimilarTrendModal;
