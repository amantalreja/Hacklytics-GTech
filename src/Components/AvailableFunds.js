// AvailableFunds.js
import React from "react";
import "./AvailableFunds.css";

const AvailableFunds = () => {
  // Sample metric values; you can replace these with dynamic data.
  const cashbackEarned = "$350";
  const cashbackGrowth = "8%";
  const investedPastYear = "$5000";
  const investedGrowth = "12%";
  const incubatorVisits = 12;
  const visitsGrowth = "5%";
  const talksAttended = 5;
  const talksGrowth = "10%";

  return (
    <div id="available-funds">
      <h2>Performance Metrics</h2>
      <ul>
        <li>
          <span>
            <strong>Cashback Earned:</strong> {cashbackEarned}
          </span>
          <span className="growth">{cashbackGrowth}</span>
        </li>
        <li>
          <span>
            <strong>Invested Past Year:</strong> {investedPastYear}
          </span>
          <span className="growth">{investedGrowth}</span>
        </li>
        <li>
          <span>
            <strong>Incubator Visits:</strong> {incubatorVisits}
          </span>
          <span className="growth">{visitsGrowth}</span>
        </li>
        <li>
          <span>
            <strong>Capital One Talks Attended:</strong> {talksAttended}
          </span>
          <span className="growth">{talksGrowth}</span>
        </li>
      </ul>
    </div>
  );
};

export default AvailableFunds;
