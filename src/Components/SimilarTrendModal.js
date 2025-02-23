// SimilarTrendModal_v3.js
import React, { useState, useEffect, useMemo } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./SimilarTrendModal.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// External Tooltip Handlers (unchanged)
function externalLineTooltipHandler(context) {
  const { chart, tooltip } = context;
  let tooltipEl = chart.canvas.parentNode.querySelector("div.line-tooltip");

  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.className = "line-tooltip";
    tooltipEl.style.background = "rgba(0, 0, 0, 0.7)";
    tooltipEl.style.borderRadius = "4px";
    tooltipEl.style.color = "#fff";
    tooltipEl.style.opacity = 1;
    tooltipEl.style.pointerEvents = "none";
    tooltipEl.style.position = "absolute";
    tooltipEl.style.transform = "translate(-50%, 0)";
    tooltipEl.style.transition = "all .1s ease";
    tooltipEl.style.padding = "6px";
    tooltipEl.style.whiteSpace = "nowrap";
    tooltipEl.style.font = "14px sans-serif";
    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = chart.canvas.offsetLeft + tooltip.caretX + "px";
  tooltipEl.style.top = chart.canvas.offsetTop + tooltip.caretY + "px";

  if (!tooltip.dataPoints || !tooltip.dataPoints.length) {
    tooltipEl.innerHTML = "";
    return;
  }

  const dataPoint = tooltip.dataPoints[0];
  const dataset = dataPoint.dataset;
  const dataIndex = dataPoint.dataIndex;
  const label = dataset.label;
  const currentValue = dataPoint.parsed.y;

  const line1 = `<div style="font-weight:bold; margin-bottom:2px;">${label}</div>`;
  const line2 = `<div style="color:#fff;">&nbsp;&nbsp;Value: ${currentValue}</div>`;
  let line3 = "";

  if (dataIndex === 0) {
    line3 = `<div style="color:#fff;">&nbsp;&nbsp;Change: N/A</div>`;
  } else {
    const previousValue = dataset.data[dataIndex - 1];
    const diff = currentValue - previousValue;
    let arrow = diff > 0 ? "↑" : diff < 0 ? "↓" : "→";
    let sign = diff > 0 ? "+" : diff < 0 ? "-" : "";
    const absDiff = Math.abs(diff).toFixed(2);

    let percentChange = 0;
    if (previousValue === 0 && currentValue !== 0) {
      percentChange = Infinity;
    } else if (previousValue !== 0) {
      percentChange = (Math.abs(diff) / Math.abs(previousValue)) * 100;
    }
    const percentStr = percentChange === Infinity ? "∞" : percentChange.toFixed(2);
    let arrowColor =
      arrow === "↑" || sign === "+" ? "limegreen" : arrow === "↓" || sign === "-" ? "red" : "#fff";

    line3 = `
      <div style="color:#fff;">
        &nbsp;&nbsp;Change:
        <span style="color:${arrowColor};">
          ${arrow} ${absDiff} (${sign}${percentStr}%)
        </span>
      </div>
    `;
  }

  tooltipEl.innerHTML = line1 + line2 + line3;
}

function externalBarTooltipHandler(context) {
  const { chart, tooltip } = context;
  let tooltipEl = chart.canvas.parentNode.querySelector("div.bar-tooltip");

  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.className = "bar-tooltip";
    tooltipEl.style.background = "rgba(0, 0, 0, 0.7)";
    tooltipEl.style.borderRadius = "4px";
    tooltipEl.style.color = "#fff";
    tooltipEl.style.opacity = 1;
    tooltipEl.style.pointerEvents = "none";
    tooltipEl.style.position = "absolute";
    tooltipEl.style.transform = "translate(-50%, 0)";
    tooltipEl.style.transition = "all .1s ease";
    tooltipEl.style.padding = "6px";
    tooltipEl.style.whiteSpace = "nowrap";
    tooltipEl.style.font = "14px sans-serif";
    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = chart.canvas.offsetLeft + tooltip.caretX + "px";
  tooltipEl.style.top = chart.canvas.offsetTop + tooltip.caretY + "px";

  if (!tooltip.dataPoints || !tooltip.dataPoints.length) {
    tooltipEl.innerHTML = "";
    return;
  }

  const dataPoint = tooltip.dataPoints[0];
  const label = dataPoint.label;
  const currentValue = dataPoint.parsed.y;

  const line1 = `<div style="font-weight:bold; margin-bottom:2px;">${label}</div>`;
  const line2 = `<div style="color:#fff;">&nbsp;&nbsp;Value: ${currentValue}</div>`;
  const line3 = `<div style="color:#fff;">&nbsp;&nbsp;Change: N/A</div>`;

  tooltipEl.innerHTML = line1 + line2 + line3;
}

const SimilarTrendModal_v3 = ({ isOpen, onClose }) => {
  const tabs = [
    "All Companies",
    "OpenAI",
    "SpaceX",
    "Stripe",
    "Scale AI",
    "Moneyview",
    "Rapido",
  ];
  const [selectedTab, setSelectedTab] = useState("All Companies");
  const [closing, setClosing] = useState(false);

  // Initial fallback data (in case API calls fail)
  const [chartData, setChartData] = useState({
    revenueData: {
      OpenAI: [0.0, 0.02, 0.20, 1.30, 3.70],
      SpaceX: [2.0, 2.60, 4.60, 5.40, 9.00],
      Stripe: [7.40, 9.00, 12.00, 17.40, 20.00],
      "Scale AI": [0.05, 0.10, 0.29, 0.76, 1.00],
      Moneyview: [0.02, 0.03, 0.05, 0.07, 0.12],
      Rapido: [0.01, 0.02, 0.03, 0.045, 0.075],
    },
    valuationData: {
      OpenAI: [14, 14, 29, 80, 157],
      SpaceX: [100, 110, 137, 210, 350],
      Stripe: [36, 95, 95, 50, 65],
      "Scale AI": [3.5, 7.0, 7.3, 7.3, 13.8],
      Moneyview: [0.3, 0.6, 0.8, 0.9, 1.2],
      Rapido: [0.2, 0.3, 0.5, 0.83, 1.0],
    },
    growthData: {
      OpenAI: 300,
      SpaceX: 30,
      Stripe: 20,
      "Scale AI": 70,
      Moneyview: 50,
      Rapido: 40,
    },
  });

  // Define startupTickerMapping using useMemo to keep it stable
  const startupTickerMapping = useMemo(() => ({
    OpenAI: "AAPL",
    SpaceX: "MSFT",
    Stripe: "GOOGL",
    "Scale AI": "AMZN",
    Moneyview: "META", // Facebook/Meta
    Rapido: "TSLA",
  }), []);

  // Fetch updated data from Financial Modeling Prep for each ticker
  useEffect(() => {
    async function fetchData() {
      try {
        const promises = Object.entries(startupTickerMapping).map(
          async ([startup, ticker]) => {
            const response = await fetch(
              `https://financialmodelingprep.com/api/v3/financials/income-statement/${ticker}?apikey=demo`
            );
            const json = await response.json();
            // Use the first 5 entries (most recent 5 years) and reverse for ascending order
            const financials = json.financials.slice(0, 5).reverse();
            // Extract revenue in billions
            const revenue = financials.map((item) => parseFloat(item["Revenue"]) / 1e9);
            return { startup, revenue };
          }
        );
        const results = await Promise.all(promises);
        const newRevenueData = {};
        results.forEach(({ startup, revenue }) => {
          newRevenueData[startup] = revenue;
        });
        // Build valuationData using multipliers
        const newValuationData = {};
        Object.entries(newRevenueData).forEach(([startup, revenue]) => {
          let multiplier = 10;
          if (startup === "SpaceX") multiplier = 15;
          else if (startup === "Stripe") multiplier = 12;
          else if (startup === "Scale AI") multiplier = 8;
          else if (startup === "Moneyview") multiplier = 3;
          else if (startup === "Rapido") multiplier = 2;
          newValuationData[startup] = revenue.map((val) => val * multiplier);
        });
        const newGrowthData = {
          OpenAI: 300,
          SpaceX: 30,
          Stripe: 20,
          "Scale AI": 70,
          Moneyview: 50,
          Rapido: 40,
        };

        setChartData({
          revenueData: newRevenueData,
          valuationData: newValuationData,
          growthData: newGrowthData,
        });
      } catch (error) {
        console.error("Error fetching real-time data:", error);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [startupTickerMapping]);

  if (!isOpen) return null;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 300);
  };

  // ---------------- DATA SETS ----------------
  const years = [2020, 2021, 2022, 2023, 2024];
  const { revenueData, valuationData, growthData } = chartData;

  const colorMap = {
    OpenAI: "rgba(255, 99, 132, 1)",
    SpaceX: "rgba(54, 162, 235, 1)",
    Stripe: "rgba(255, 206, 86, 1)",
    "Scale AI": "rgba(75, 192, 192, 1)",
    Moneyview: "rgba(153, 102, 255, 1)",
    Rapido: "rgba(255, 159, 64, 1)",
  };

  // Helper: Filter data based on selectedTab
  const filterData = (dataObj) => {
    if (selectedTab === "All Companies") return dataObj;
    return Object.keys(dataObj)
      .filter((key) => key === selectedTab)
      .reduce((filtered, key) => {
        filtered[key] = dataObj[key];
        return filtered;
      }, {});
  };

  // Prepare line datasets
  const prepareLineDatasets = (dataObj) =>
    Object.keys(dataObj).map((startup) => ({
      label: startup,
      data: dataObj[startup],
      borderColor: colorMap[startup],
      backgroundColor: colorMap[startup],
      fill: false,
      tension: 0.1,
    }));

  // Chart options with maintainAspectRatio disabled
  const createLineChartOptions = (titleText) => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "nearest", intersect: true },
    plugins: {
      title: { display: true, text: titleText },
      tooltip: { enabled: false, external: externalLineTooltipHandler },
    },
    elements: { point: { radius: 4, hoverRadius: 8, hitRadius: 20 } },
    scales: { y: { beginAtZero: true } },
  });

  const createBarChartOptions = (titleText) => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "nearest", intersect: true },
    plugins: {
      title: { display: true, text: titleText },
      legend: { display: false },
      tooltip: { enabled: false, external: externalBarTooltipHandler },
    },
    scales: { y: { beginAtZero: true } },
  });

  const filteredRevenueData = filterData(revenueData);
  const filteredValuationData = filterData(valuationData);

  const revenueChartData = {
    labels: years,
    datasets: prepareLineDatasets(filteredRevenueData),
  };
  const revenueChartOptions = createLineChartOptions(
    "Annual Revenue (2020–2024) [Billions USD]"
  );

  const valuationChartData = {
    labels: years,
    datasets: prepareLineDatasets(filteredValuationData),
  };
  const valuationChartOptions = createLineChartOptions(
    "Valuation (2020–2024) [Billions USD]"
  );

  const growthLabels = Object.keys(growthData).filter((key) =>
    selectedTab === "All Companies" ? true : key === selectedTab
  );
  const growthValues = growthLabels.map((key) => growthData[key]);
  const growthChartData = {
    labels: growthLabels,
    datasets: [
      {
        label: "Avg Annual Revenue Growth (%)",
        data: growthValues,
        backgroundColor: growthLabels.map((lbl) => colorMap[lbl]),
      },
    ],
  };
  const growthChartOptions = createBarChartOptions("Average Annual Revenue Growth");

  return (
    <div className={`overlay ${closing ? "closing" : ""}`}>
      <div className={`modal-content ${closing ? "closing" : ""}`}>
        <button className="close-btn" onClick={handleClose}>
          ✕
        </button>
        <h2>Similar Companies</h2>
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
        <div className="tab-content">
          <h3>{selectedTab} Data</h3>
          <div
            className="chart-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <div
              className="chart-container"
              style={{
                background: "#f0f0f0",
                padding: "1rem",
                height: "400px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h4 style={{ textAlign: "center" }}>Annual Revenue (2020–2024)</h4>
              <div style={{ flex: 1 }}>
                <Line data={revenueChartData} options={revenueChartOptions} />
              </div>
            </div>
            <div
              className="chart-container"
              style={{
                background: "#f0f0f0",
                padding: "1rem",
                height: "400px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h4 style={{ textAlign: "center" }}>Valuation (2020–2024)</h4>
              <div style={{ flex: 1 }}>
                <Line data={valuationChartData} options={valuationChartOptions} />
              </div>
            </div>
            <div
              className="chart-container"
              style={{
                background: "#f0f0f0",
                padding: "1rem",
                height: "400px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h4 style={{ textAlign: "center" }}>Average Annual Revenue Growth</h4>
              <div style={{ flex: 1 }}>
                <Bar data={growthChartData} options={growthChartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimilarTrendModal_v3;
