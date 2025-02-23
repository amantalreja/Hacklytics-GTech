import React, { useState } from "react";
import SimilarTrendModal from "./SimilarTrendModal";
import InvestmentPopup from "./InvestmentPopup"; // New Component
import "./StartupCard.css";

const StartupCard = ({
  logo,
  name,
  description,
  goal,
  invested,
  stake,
  totalUsers,
  team,
  onInvest,
  investedStatus
}) => {
  const [showTrendModal, setShowTrendModal] = useState(false);
  const [showInvestmentPopup, setShowInvestmentPopup] = useState(false);
  const progress = Math.min((invested / goal) * 100, 100);

  return (
    <>
      <div className={`card ${investedStatus ? "invested" : ""}`}>
        {/* Card Header */}
        <div className="card-header">
          <img src={logo} alt={`${name} logo`} className="startup-logo" />
          <h3 className="startup-name">{name}</h3>
          <div className="team-avatars">
            {team &&
              team.map((url, index) => (
                <img key={index} src={url} alt="team member" className="team-avatar" />
              ))}
          </div>
        </div>

        {/* Description */}
        <p className="startup-description">{description}</p>

        {/* Progress Bar & Goal Amount */}
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="progress-text">
            <strong>${invested.toLocaleString()}</strong> of <strong>${goal.toLocaleString()}</strong> invested
          </p>
        </div>

        {/* Investment Details */}
        <div className="investment-details">
          <span><strong>Total Invested:</strong> ${invested.toLocaleString()}</span>
          <span><strong>CapitalOne Stake:</strong> {stake}</span>
          <span><strong>Total Users:</strong> {totalUsers}</span>
        </div>

        {/* Buttons */}
        <div className="button-row">
          {!investedStatus && onInvest && (
            <button className="invest-button" onClick={() => setShowInvestmentPopup(true)}>
              Invest
            </button>
          )}
          <button className="trend-button" onClick={() => setShowTrendModal(true)}>
            Similar Startup Trend
          </button>
        </div>
      </div>

      {/* Investment Modal */}
      <InvestmentPopup
        isOpen={showInvestmentPopup}
        onClose={() => setShowInvestmentPopup(false)}
        onConfirm={(amount) => {
          onInvest(amount);
          setShowInvestmentPopup(false);
        }}
        goal={goal}
        startupName={name}  // Passing startup name as key per your schema.
      />

      {/* Similar Trend Modal */}
      <SimilarTrendModal isOpen={showTrendModal} onClose={() => setShowTrendModal(false)} />
    </>
  );
};

export default StartupCard;
