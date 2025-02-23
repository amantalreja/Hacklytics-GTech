import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Line, Bar, Pie } from "react-chartjs-2";
import "./Insights.css";

// Import and register Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement, // Required for Pie charts
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const YEARS = [0, 1, 2, 3, 4];

const Insights = () => {
  // Input state variables
  const [monthlySignupsStr, setMonthlySignupsStr] = useState("1000");
  const [monthlySpendingStr, setMonthlySpendingStr] = useState("1000");
  const [savorOneGrowthRateStr, setSavorOneGrowthRateStr] = useState("5");
  const [ventureStudioGrowthRateStr, setVentureStudioGrowthRateStr] = useState("10");
  const [investmentReturnRateStr, setInvestmentReturnRateStr] = useState("5");

  // Toggle for graph mode: false => show startup count, true => show investment dollars
  const [showInvestment, setShowInvestment] = useState(false);
  // Toggle to show/hide the additional "Total Investment" line
  const [showTotalLine, setShowTotalLine] = useState(false);

  // Convert string inputs to numbers
  const monthlySignups = parseFloat(monthlySignupsStr) || 0;
  const monthlySpending = parseFloat(monthlySpendingStr) || 0;
  const savorOneGrowthRate = parseFloat(savorOneGrowthRateStr) || 0;
  const ventureStudioGrowthRate = parseFloat(ventureStudioGrowthRateStr) || 0;
  const investmentReturnRate = parseFloat(investmentReturnRateStr) || 0;

  // Constants & Assumptions
  const savorOneSignupBonus = 200;
  const savorOneMultiplier = 0.001; // 0.1% acquisition cost for Savor One
  const ventureStudioMultiplier = 0.0005; // 0.05% acquisition cost for Venture Studio
  const months = 48; // 4 years
  const costPerStartup = 10000; // each startup requires $10k

  // ------------------------------
  // 1) Cost Per User Calculations
  // ------------------------------
  const {
    savorOneCostPerUser,
    ventureStudioCostPerUser,
    bonusInvestmentFutureValue,
    investmentFundContribution,
    savorOneSpendingCost,
  } = useMemo(() => {
    // Savor One: spending-based cost for 4 years plus one-time sign-up bonus
    const s1SpendingCost = monthlySpending * savorOneMultiplier * months;
    const s1Cost = savorOneSignupBonus + s1SpendingCost;

    // Venture Studio: raw acquisition cost & bonus future value
    const rawAcquisitionCost = monthlySpending * ventureStudioMultiplier * months;
    const ventureStudioMonthlyDeposit = 400 / months; // $400 spread over 4 years

    const monthlyInterestRate = investmentReturnRate / 100 / 12;
    const bonusFV =
      monthlyInterestRate === 0
        ? ventureStudioMonthlyDeposit * months
        : ventureStudioMonthlyDeposit *
          ((Math.pow(1 + monthlyInterestRate, months) - 1) / monthlyInterestRate);

    const netCost = rawAcquisitionCost - bonusFV;
    const savings = netCost < 0 ? Math.abs(netCost) : 0;
    const reinvestmentPercentage = 0.2;
    const fundContribution = savings * reinvestmentPercentage;

    return {
      savorOneCostPerUser: s1Cost,
      ventureStudioCostPerUser: netCost,
      bonusInvestmentFutureValue: bonusFV,
      investmentFundContribution: fundContribution,
      savorOneSpendingCost: s1SpendingCost,
    };
  }, [monthlySpending, investmentReturnRate]);

  // ------------------------------
  // 2) Sign-Up and Startup Growth Data
  // ------------------------------
  const savorOneSignupsData = useMemo(() =>
    YEARS.map((year) =>
      Math.round(monthlySignups * Math.pow(1 + savorOneGrowthRate / 100, year))
    ),
  [monthlySignups, savorOneGrowthRate]);

  const ventureStudioSignupsData = useMemo(() =>
    YEARS.map((year) =>
      Math.round(monthlySignups * Math.pow(1 + ventureStudioGrowthRate / 100, year))
    ),
  [monthlySignups, ventureStudioGrowthRate]);

  // Use spending to calculate money saved for Venture Studio.
  // Assume Cap One saves 0.2% (0.002) of each user's monthly spending.
  const investmentRate = 0.002;
  const ventureStudioMoneyData = useMemo(() => {
    return YEARS.map((year) => {
      const numUsers = ventureStudioSignupsData[year];
      return numUsers * monthlySpending * 12 * investmentRate;
    });
  }, [ventureStudioSignupsData, monthlySpending]);

  // Calculate annual startups funded (as an integer) based on saved money.
  const ventureStudioAnnualStartupsData = useMemo(() => {
    return ventureStudioMoneyData.map((funds) => Math.floor(funds / costPerStartup));
  }, [ventureStudioMoneyData]);

  // Build cumulative funded startups (integer)
  const ventureStudioCumulativeStartupsData = useMemo(() => {
    let cumulative = 0;
    return YEARS.map((year) => {
      if (year === 0) return 0;
      cumulative += ventureStudioAnnualStartupsData[year];
      return cumulative;
    });
  }, [ventureStudioAnnualStartupsData]);

  // Build cumulative investment dollars from spending
  const cumulativeInvestmentData = useMemo(() => {
    let cumulative = 0;
    return YEARS.map((year) => {
      if (year === 0) return 0;
      const annualInvestment = ventureStudioSignupsData[year] * monthlySpending * 12 * investmentRate;
      cumulative += annualInvestment;
      return cumulative;
    });
  }, [ventureStudioSignupsData, monthlySpending, investmentRate]);

  // ------------------------------
  // 2.5) Total Investment in Startups (4 yrs) from acquisition savings (for the card)
  // ------------------------------
  const totalInvestment = useMemo(() => {
    const totalMonthlySignUps = ventureStudioSignupsData.slice(1).reduce((acc, val) => acc + val, 0);
    const totalUsers = totalMonthlySignUps * 12;
    return totalUsers * investmentFundContribution;
  }, [ventureStudioSignupsData, investmentFundContribution]);

  // To add a line for "Total Investment in Startups (4 yrs)" that grows year by year,
  // we create a cumulative array by linearly interpolating from 0 at Year 0 to totalInvestment at the final year.
  const cumulativeAcquisitionSavings = useMemo(() => {
    const lastYear = YEARS[YEARS.length - 1];
    return YEARS.map((year) => (year / lastYear) * totalInvestment);
  }, [totalInvestment]);

  // In the cumulative chart, if in startup mode, convert dollars to equivalent startups.
  const totalLineDataset = useMemo(() => {
    if (showInvestment) {
      return cumulativeAcquisitionSavings;
    } else {
      return cumulativeAcquisitionSavings.map((val) => val / costPerStartup);
    }
  }, [cumulativeAcquisitionSavings, showInvestment, costPerStartup]);

  // ------------------------------
  // 3) Chart Configurations and Options
  // ------------------------------
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true },
    },
  };

  // a) Sign-Up Growth Chart (unchanged)
  const signupsChartData = {
    labels: YEARS.map((y) => `Year ${y}`),
    datasets: [
      {
        label: "Savor One (Monthly Sign-Ups)",
        data: savorOneSignupsData,
        borderColor: "#EE4266",
        backgroundColor: "rgba(238, 66, 102, 0.2)",
        tension: 0.3,
      },
      {
        label: "Venture Studio (Monthly Sign-Ups)",
        data: ventureStudioSignupsData,
        borderColor: "#4C9F70",
        backgroundColor: "rgba(76, 159, 112, 0.2)",
        tension: 0.3,
      },
    ],
  };

  // b) Cumulative Chart Data with two toggles:
  //   - Toggle 1 (showInvestment): switches between cumulative startups (or equivalent) and cumulative investment dollars.
  //   - Toggle 2 (showTotalLine): shows/hides the additional total investment line.
  const cumulativeChartData = useMemo(() => {
    let baseDataset;
    if (!showInvestment) {
      baseDataset = {
        label: "Cumulative Funded Startups",
        data: ventureStudioCumulativeStartupsData,
        borderColor: "#4C9F70",
        backgroundColor: "rgba(76, 159, 112, 0.2)",
        tension: 0.3,
      };
    } else {
      baseDataset = {
        label: "Cumulative Investment Dollars",
        data: cumulativeInvestmentData,
        borderColor: "#FF8C00",
        backgroundColor: "rgba(255, 140, 0, 0.2)",
        tension: 0.3,
      };
    }
    const datasets = [baseDataset];

    if (showTotalLine) {
      datasets.push({
        label: "Total Investment in Startups (4 Years)",
        data: totalLineDataset,
        borderColor: "#FF0000",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        tension: 0.3,
        borderDash: [6, 4],
      });
    }

    return {
      labels: YEARS.map((y) => `Year ${y}`),
      datasets,
    };
  }, [
    showInvestment,
    showTotalLine,
    ventureStudioCumulativeStartupsData,
    cumulativeInvestmentData,
    totalLineDataset,
  ]);

  // c) Cost Comparison Chart (unchanged)
  const costComparisonChartData = {
    labels: ["Savor One", "Venture Studio"],
    datasets: [
      {
        label: "Cost per User (4 Years)",
        data: [savorOneCostPerUser, ventureStudioCostPerUser],
        backgroundColor: [
          "rgba(238, 66, 102, 0.7)",
          "rgba(76, 159, 112, 0.7)",
        ],
      },
    ],
  };

  // d) Pie Chart for Individual Sign-Up Distribution (Years 1-4) (unchanged)
  const pieLabels = [];
  const pieData = [];
  for (let year = 1; year <= 4; year++) {
    pieLabels.push(`Year ${year} Savor One`);
    pieLabels.push(`Year ${year} Venture Studio`);
    pieData.push(savorOneSignupsData[year]);
    pieData.push(ventureStudioSignupsData[year]);
  }
  const signupsPieChartData = {
    labels: pieLabels,
    datasets: [
      {
        data: pieData,
        backgroundColor: [
          "#8B0000", // Yr1 Savor One: Dark red
          "#CD5C5C", // Yr1 Venture Studio: Lighter red
          "#8B4513", // Yr2 Savor One: Dark brown
          "#CD853F", // Yr2 Venture Studio: Lighter brown
          "#006400", // Yr3 Savor One: Dark green
          "#66CDAA", // Yr3 Venture Studio: Lighter green
          "#000080", // Yr4 Savor One: Dark navy
          "#0000CD", // Yr4 Venture Studio: Lighter navy
        ],
        hoverBackgroundColor: [
          "#800000",
          "#B22222",
          "#7A3E0F",
          "#B87333",
          "#005000",
          "#5CAC2D",
          "#000070",
          "#0000A0",
        ],
      },
    ],
  };

  // ------------------------------
  // 4) RENDER
  // ------------------------------
  return (
    <div className="container">
      <header>
        <h1>Capital One Investment Insights</h1>
        <nav>
          <Link to="/">Back to Home</Link>
        </nav>
      </header>

      {/* Sticky Input Row */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 999,
          backgroundColor: "#fff",
          padding: "1rem 0",
        }}
      >
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
            <label>Monthly Spending ($)</label>
            <input
              type="number"
              placeholder="0"
              value={monthlySpendingStr}
              onChange={(e) => setMonthlySpendingStr(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Savor One Growth Rate (%)</label>
            <input
              type="number"
              placeholder="0"
              value={savorOneGrowthRateStr}
              onChange={(e) => setSavorOneGrowthRateStr(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Venture Studio Growth (%)</label>
            <input
              type="number"
              placeholder="0"
              value={ventureStudioGrowthRateStr}
              onChange={(e) => setVentureStudioGrowthRateStr(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Investment Return Rate (%)</label>
            <input
              type="number"
              placeholder="0"
              value={investmentReturnRateStr}
              onChange={(e) => setInvestmentReturnRateStr(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* COMPARISON SECTION */}
      <div className="comparison-section">
        {/* Capital One Savor One */}
        <div className="comparison-card">
        <img src={require("../savorone.png")} alt="Savor One" width={330}/>
          <div className="card-header">
            <h3>Capital One Savor One</h3>
          </div>
          <div className="comparison-data">
            <div className="comparison-item">
              <span>Monthly Sign-Ups (Year1):</span>
              <span className="comparison-value">
                {savorOneSignupsData[1].toLocaleString("en-US")}
              </span>
            </div>
            <div className="comparison-item">
              <span>Growth Rate:</span>
              <span className="comparison-value">
                +{Number(savorOneGrowthRate).toLocaleString("en-US")}%
              </span>
            </div>
            <div className="comparison-item">
              <span>Sign-Up Bonus (One-Time):</span>
              <span className="comparison-value">
                $
                {savorOneSignupBonus.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="comparison-item">
              <span>Spending-Based Cost (4 Years):</span>
              <span className="comparison-value">
                $
                {savorOneSpendingCost.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="comparison-item">
              <span>Total Cost (4 Years):</span>
              <span className="comparison-value">
                $
                {savorOneCostPerUser.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Capital One Venture Studio */}
        <div className="comparison-card">
        <img
          src={require("../VentureStudio.png")}
          alt="VentureStudio"
          width={400}
          style={{ border: "0px solid #6c63ff", borderRadius: "10px" }}
        />
          <div className="card-header">
            <h3>Capital One Venture Studio</h3>
          </div>
          <div className="comparison-data">
            <div className="comparison-item">
              <span>Monthly Sign-Ups (Year1):</span>
              <span className="comparison-value">
                {ventureStudioSignupsData[1].toLocaleString("en-US")}
              </span>
            </div>
            <div className="comparison-item">
              <span>Growth Rate:</span>
              <span className="comparison-value">
                +{Number(ventureStudioGrowthRate).toLocaleString("en-US")}%
              </span>
            </div>
            <div className="comparison-item">
              <span>Bonus Future Value (4 Years):</span>
              <span className="comparison-value">
                $
                {bonusInvestmentFutureValue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="comparison-item">
              <span>Net Cost (4 Years):</span>
              <span className="comparison-value">
                $
                {ventureStudioCostPerUser.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="comparison-item">
              <span>Investment Fund Contribution (20% Savings):</span>
              <span className="comparison-value">
                $
                {investmentFundContribution.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="comparison-item">
              <span>Total Investment in Startups (4 Years):</span>
              <span className="comparison-value">
                $
                {totalInvestment.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="charts-row">
        {/* Sign-Up Growth Chart */}
        <div className="chart-container">
          <h3>Sign-Up Growth Over 4 Years</h3>
          <Line
            data={signupsChartData}
            options={{
              ...lineChartOptions,
              plugins: {
                ...lineChartOptions.plugins,
                title: { display: true, text: "Monthly Sign-Up Growth" },
              },
            }}
          />
        </div>

        {/* Cumulative Chart with Two Toggles */}
        <div className="chart-container">
          {/* Header with two toggles */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "1rem",
            }}
          >
            {/* Row 1: Toggle between Startup Count and Investment Dollars */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <h3 style={{ margin: 0 }}>
                {!showInvestment
                  ? "Cumulative Startup Growth Over 4 Years"
                  : "Cumulative Investment Dollars Over 4 Years"}
              </h3>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: "0.5rem" }}>
                  {!showInvestment ? "Startups" : "Investment"}
                </span>
                <div
                  onClick={() => setShowInvestment(!showInvestment)}
                  style={{
                    width: "50px",
                    height: "24px",
                    backgroundColor: showInvestment ? "#4c9f70" : "#ccc",
                    borderRadius: "999px",
                    position: "relative",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      position: "absolute",
                      top: "2px",
                      left: showInvestment ? "26px" : "2px",
                      transition: "left 0.3s",
                    }}
                  />
                </div>
              </div>
            </div>
            {/* Row 2: Toggle for showing/hiding the Total Investment line */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <span style={{ marginRight: "0.5rem" }}>
                {showTotalLine ? "Hide" : "Show"} Total Investment Line
              </span>
              <div
                onClick={() => setShowTotalLine(!showTotalLine)}
                style={{
                  width: "50px",
                  height: "24px",
                  backgroundColor: showTotalLine ? "#4c9f70" : "#ccc",
                  borderRadius: "999px",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: "#fff",
                    borderRadius: "50%",
                    position: "absolute",
                    top: "2px",
                    left: showTotalLine ? "26px" : "2px",
                    transition: "left 0.3s",
                  }}
                />
              </div>
            </div>
          </div>

          <Line
            data={cumulativeChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: !showInvestment
                    ? "Cumulative Funded Startups (Based on Spending)"
                    : "Cumulative Investment Dollars (Based on Spending)",
                },
              },
            }}
          />
        </div>
      </div>

      <div className="charts-row">
        {/* Cost Comparison Chart */}
        <div className="chart-container">
          <h3>Cost Comparison (4-yr Cost per User)</h3>
          <Bar
            data={costComparisonChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "Cost Comparison: Savor One vs. Venture Studio",
                },
              },
            }}
          />
        </div>

        {/* Pie Chart */}
        <div className="chart-container">
          <h3>Individual Sign-Up Distribution (Years 1-4)</h3>
          <Pie
            data={signupsPieChartData}
            width={250}
            height={250}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "right" },
                title: {
                  display: true,
                  text: "Individual Sign-Ups by Year and Product",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Insights;
