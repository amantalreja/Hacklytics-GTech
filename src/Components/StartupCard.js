import React, { useState } from "react";
import SimilarTrendModal from "./SimilarTrendModal";

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
  investedStatus // true if already invested
}) => {
  const [showTrendModal, setShowTrendModal] = useState(false);
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
                <img
                  key={index}
                  src={url}
                  alt="team member"
                  className="team-avatar"
                />
              ))}
          </div>
        </div>

        {/* Description */}
        <p className="startup-description">{description}</p>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Investment Details */}
        <div className="investment-details">
          <span>
            <strong>Total Invested:</strong> ${invested.toLocaleString()}
          </span>
          <span>
            <strong>CapitalOne Stake:</strong> {stake}
          </span>
          <span>
            <strong>Total Users:</strong> {totalUsers}
          </span>
        </div>

        {/* Buttons */}
        <div className="button-row">
          {!investedStatus && onInvest && (
            <button className="invest-button" onClick={onInvest}>
              Invest
            </button>
          )}
          <button
            className="trend-button"
            onClick={() => setShowTrendModal(true)}
          >
            Similar Startup Trend
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      <SimilarTrendModal
        isOpen={showTrendModal}
        onClose={() => setShowTrendModal(false)}
      />
    </>
  );
};

export default StartupCard;
