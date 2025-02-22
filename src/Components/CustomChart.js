// CustomChart.js
import React from "react";
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

const chartTypes = {
  line: Line,
  bar: Bar,
};

const CustomChart = ({ type = "line", data, options }) => {
  const ChartComponent = chartTypes[type] || Line;
  return <ChartComponent data={data} options={options} />;
};

export default CustomChart;
