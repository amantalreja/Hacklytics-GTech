import React, { useState } from "react";
import "./InvestmentPopup.css";

const InvestmentPopup = ({ isOpen, onClose, onConfirm, goal }) => {
  const [investmentAmount, setInvestmentAmount] = useState("");

  const handleInvest = () => {
    if (investmentAmount > 0) {
      onConfirm(parseFloat(investmentAmount));
      setInvestmentAmount("");
    }
  };

  const handleCancel = () => {
    setInvestmentAmount("");
    onClose();
  };

  return isOpen ? (
    <div className="investment-overlay">
      <div className="investment-popup">
        <button className="close-btn" onClick={handleCancel}>✕</button>
        <h3>Invest in Startup</h3>
        <p>
          Total Available Stake: <strong>${goal.toLocaleString()}</strong>
        </p>

        <label>Enter Amount ($)</label>
        <input
          type="number"
          value={investmentAmount}
          onChange={(e) => setInvestmentAmount(e.target.value)}
          placeholder="Enter investment amount"
        />

        {/* Calculate & Show Equity Stake */}
        {investmentAmount > 0 && (
          <p className="equity-info">
            Estimated Equity:{" "}
            <strong>{((investmentAmount / goal) * 100).toFixed(2)}%</strong>
          </p>
        )}

        <div className="button-group">
          <button className="confirm-invest-btn" onClick={handleInvest}>
            Confirm Investment
          </button>
          <button className="cancel-invest-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default InvestmentPopup;
