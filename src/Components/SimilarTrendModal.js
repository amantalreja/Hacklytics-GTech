// SimilarTrendModal.js
import React, { useState } from "react";
import "./SimilarTrendModal.css";
import CustomChart from "./CustomChart"; // Import the chart component

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
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 300);
  };

  // Sample Data for Line & Bar Charts
  const sampleData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Growth",
        data: [15, 25, 35, 50, 65, 80],
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const sampleOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Company Growth",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Dynamic Content Renderer
  const renderContent = () => (
    <>
      <h3>{selectedTab} Data</h3>
      <div className="graphs-row">
        <div className="graph">
          <h4>Growth</h4>
          <CustomChart type="line" data={sampleData} options={sampleOptions} />
        </div>
        <div className="graph">
          <h4>Valuation</h4>
          <CustomChart type="bar" data={sampleData} options={sampleOptions} />
        </div>
        <div className="graph">
          <h4>Revenue (Last 5 Years)</h4>
          <CustomChart type="line" data={sampleData} options={sampleOptions} />
        </div>
      </div>
    </>
  );

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
