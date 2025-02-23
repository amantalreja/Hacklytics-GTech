import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import "./Insights.css";

// Register Chart.js components if you're using React 18+
// (Optional, depends on your version of react-chartjs-2 / chart.js)
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

const Insights = () => {
  // Store as strings to fix the "stuck at 0" backspace issue
  const [monthlySignupsStr, setMonthlySignupsStr] = useState("1000");
  const [signupBonusStr, setSignupBonusStr] = useState("250");
  const [monthlySpendingStr, setMonthlySpendingStr] = useState("1000");
  const [growthRateStr, setGrowthRateStr] = useState("5");

  // Safely parse the strings to numbers
  const monthlySignups = parseFloat(monthlySignupsStr) || 0;
  const signupBonus = parseFloat(signupBonusStr) || 0;
  const monthlySpending = parseFloat(monthlySpendingStr) || 0;
  const growthRate = parseFloat(growthRateStr) || 0;

  // -----------------------------------------
  // 1) Total Cost Over 4 Years (Per User)
  // -----------------------------------------
  // Savor One = Sign-up bonus + 0.1% (0.001) monthly spending x 48 months
  const savorOneCostPerUser =
    signupBonus + monthlySpending * 0.001 * 48;

  // Venture Studio = No sign-up bonus (if that's your logic)
  // + 0.1% monthly spending x 48 months
  const ventureStudioCostPerUser =
    0 + monthlySpending * 0.001 * 48;

  // -----------------------------------------
  // 2) Sign-Up Growth Data (Year 0 to 4)
  // -----------------------------------------
  const years = [0, 1, 2, 3, 4];

  // We'll assume "annual sign-ups" = monthlySignups * 12, or you can leave it as monthly.
  // For demonstration, let's keep it as "monthly average" for each year.

  // Savor One: No growth
  const savorOneSignupsData = years.map(() => monthlySignups);

  // Venture Studio: grows by 'growthRate' % each year
  const ventureStudioSignupsData = years.map((year) =>
    Math.round(monthlySignups * Math.pow(1 + growthRate / 100, year))
  );

  // -----------------------------------------
  // 3) Startup Growth Data
  // -----------------------------------------
  // Savor One: 0
  const savorOneStartupsData = years.map(() => 0);

  // Venture Studio: 0.2% of that year’s monthly sign-ups
  // For each "year," the monthly sign-ups is ventureStudioSignupsData[year].
  // 0.2% = 0.002
  const ventureStudioStartupsData = years.map((year) => {
    const signupsThisYear = ventureStudioSignupsData[year];
    return Math.round(signupsThisYear * 0.002);
  });

  // -----------------------------------------
  // 4) Chart Configurations
  // -----------------------------------------
  // a) Sign-Up Growth Chart
  const signupsChartData = {
    labels: ["Yr 0", "Yr 1", "Yr 2", "Yr 3", "Yr 4"],
    datasets: [
      {
        label: "Savor One (Monthly)",
        data: savorOneSignupsData,
        borderColor: "#EE4266",
        backgroundColor: "rgba(238, 66, 102, 0.2)",
        tension: 0.3,
      },
      {
        label: "Venture Studio (Monthly)",
        data: ventureStudioSignupsData,
        borderColor: "#4C9F70",
        backgroundColor: "rgba(76, 159, 112, 0.2)",
        tension: 0.3,
      },
    ],
  };

  // b) Startup Growth Chart
  const startupsChartData = {
    labels: ["Yr 0", "Yr 1", "Yr 2", "Yr 3", "Yr 4"],
    datasets: [
      {
        label: "Savor One (Startups)",
        data: savorOneStartupsData,
        borderColor: "#EE4266",
        backgroundColor: "rgba(238, 66, 102, 0.2)",
        tension: 0.3,
      },
      {
        label: "Venture Studio (Startups)",
        data: ventureStudioStartupsData,
        borderColor: "#4C9F70",
        backgroundColor: "rgba(76, 159, 112, 0.2)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="container">
      <header>
        <h1>Investment Insights</h1>
        <nav>
          <Link to="/">Back to Home</Link>
        </nav>
      </header>

      {/* INPUT FIELDS */}
      <div className="input-row">
        <div className="input-group">
          <label>Monthly Sign-Ups</label>
          <input
            type="number"
            placeholder="0"
            value={monthlySignupsStr}
            onChange={(e) => setMonthlySignupsStr(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Sign-Up Bonus ($)</label>
          <input
            type="number"
            placeholder="0"
            value={signupBonusStr}
            onChange={(e) => setSignupBonusStr(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Monthly Spending ($)</label>
          <input
            type="number"
            placeholder="0"
            value={monthlySpendingStr}
            onChange={(e) => setMonthlySpendingStr(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Growth Rate (%)</label>
          <input
            type="number"
            placeholder="0"
            value={growthRateStr}
            onChange={(e) => setGrowthRateStr(e.target.value)}
          />
        </div>
      </div>

      {/* COMPARISON SECTION */}
      <div className="comparison-section">
        {/* CAPITAL ONE SAVOR ONE */}
        <div className="comparison-card">
          <div className="card-header">
            <h3>Capital One Savor One</h3>
          </div>
          <div className="comparison-data">
            <div className="comparison-item">
              <span>Monthly Sign-Ups:</span>
              <span className="comparison-value">
                {monthlySignups.toLocaleString()}
              </span>
            </div>
            <div className="comparison-item">
              <span>Growth Rate:</span>
              <span className="comparison-value">0%</span>
            </div>
            <div className="comparison-item">
              <span>Cost per User (4 yrs):</span>
              <span className="comparison-value">
                ${savorOneCostPerUser.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* CAPITAL ONE VENTURE STUDIO */}
        <div className="comparison-card">
          <div className="card-header">
            <h3>Capital One Venture Studio</h3>
          </div>
          <div className="comparison-data">
            <div className="comparison-item">
              <span>Monthly Sign-Ups (Yr1):</span>
              <span className="comparison-value">
                {ventureStudioSignupsData[1].toLocaleString()}
              </span>
            </div>
            <div className="comparison-item">
              <span>Growth Rate:</span>
              <span className="comparison-value">+{growthRate}%</span>
            </div>
            <div className="comparison-item">
              <span>Cost per User (4 yrs):</span>
              <span className="comparison-value">
                ${ventureStudioCostPerUser.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="charts-row">
        <div className="chart-container">
          <h3>Sign-Up Growth Over 4 Years</h3>
          <Line data={signupsChartData} options={{ responsive: true }} />
        </div>
        <div className="chart-container">
          <h3>Startup Growth Over 4 Years</h3>
          <Line data={startupsChartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Insights;
