import React, { useState, useEffect } from "react";
import "./InvestmentPopup.css";
import { updateStartupInvestment } from "./dynamoOperations";

const InvestmentPopup = ({ isOpen, onClose, onConfirm, goal, startupName }) => {
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Clear error when input changes
  useEffect(() => {
    setError("");
  }, [investmentAmount]);

  const handleInvest = async () => {
    const amount = parseFloat(investmentAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid investment amount.");
      return;
    }
    if (amount > goal) {
      setError("Investment amount cannot exceed the available stake.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      // Update the startup's investment details in DynamoDB using the startupName as key
      await updateStartupInvestment(startupName, amount);
      // Notify the parent component and close the popup
      onConfirm(amount);
      setInvestmentAmount("");
    } catch (err) {
      console.error("Failed to update startup investment:", err);
      setError("Failed to update investment. Please try again.");
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setInvestmentAmount("");
    setError("");
    onClose();
  };

  const estimatedEquity =
    investmentAmount > 0 && !error
      ? ((investmentAmount / goal) * 100).toFixed(2)
      : 0;

  return isOpen ? (
    <div className="investment-overlay">
      <div className="investment-popup">
        <button className="close-btn" onClick={handleCancel}>
          ✕
        </button>
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

        {error && <p className="error-message">{error}</p>}

        {investmentAmount > 0 && !error && (
          <p className="equity-info">
            Estimated Equity: <strong>{estimatedEquity}%</strong>
          </p>
        )}

        <div className="button-group">
          <button
            className="confirm-invest-btn"
            onClick={handleInvest}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Confirm Investment"}
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
