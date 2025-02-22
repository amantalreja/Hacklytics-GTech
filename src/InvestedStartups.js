import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
  Animate
} from 'recharts';
import './InvestedStartups.css';

const InvestedStartups = ({ investedStartups }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const totalInvestment = 220000; // Total initial investment

  const pieData = [
    { 
      name: 'TechNova',
      value: 45000,
      color: '#4285F4',
      description: 'AI Analytics Platform',
      growth: '+32%',
      users: '1,500',
      risk: 'Medium'
    },
    { 
      name: 'GreenFuture',
      value: 125000,
      color: '#34A853',
      description: 'Renewable Energy Solutions',
      growth: '+45%',
      users: '2,000',
      risk: 'Low'
    },
    { 
      name: 'MediCare AI',
      value: 50000,
      color: '#FBBC05',
      description: 'Healthcare Diagnostics',
      growth: '+28%',
      users: '800',
      risk: 'Medium-High'
    }
  ];

  // Enhanced growth data with company-specific growth
  const growthData = [
    { year: '2020', value: 220000, growth: 0, details: 'Initial Investment' },
    { year: '2021', value: 253000, growth: 15, details: 'Market Expansion' },
    { year: '2022', value: 291000, growth: 32, details: 'Product Development' },
    { year: '2023', value: 334650, growth: 52, details: 'International Launch' },
    { year: '2024', value: 384847, growth: 75, details: 'New Partnerships' },
    { year: '2025', value: 442574, growth: 101, details: 'Market Leadership' }
  ];

  const renderActiveShape = (props) => {
    const {
      cx, cy, innerRadius, outerRadius,
      startAngle, endAngle, fill, payload, value
    } = props;

    return (
      <g>
        {/* Outer arc with glow effect */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          filter="url(#glow)"
        />

        {/* Inner arc */}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />

        {/* Center text */}
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          fill="#1f2937"
          style={{ fontSize: '24px', fontWeight: '600' }}
        >
          {payload.name}
        </text>
        <text
          x={cx}
          y={cy + 20}
          textAnchor="middle"
          fill="#6b7280"
          style={{ fontSize: '20px', fontWeight: '500' }}
        >
          ${value.toLocaleString()}
        </text>
      </g>
    );
  };

  const CustomLineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-year">{label}</p>
          <p className="tooltip-value">Portfolio Value: ${data.value.toLocaleString()}</p>
          <p className="tooltip-growth">Growth: +{data.growth}%</p>
          <p className="tooltip-details">{data.details}</p>
        </div>
      );
    }
    return null;
  };

  const startupData = [
    { name: 'TechNova', value: 45000, color: '#4F46E5' },
    { name: 'GreenFuture', value: 125000, color: '#22C55E' },
    { name: 'MediCare AI', value: 50000, color: '#EAB308' }
  ];

  return (
    <div className="investment-summary">
      <h3>Investment Portfolio Analytics</h3>
      <div className="total-investment">
        <div className="investment-stats">
          <div className="stat-item">
            <h4>Total Investment</h4>
            <p>${totalInvestment.toLocaleString()}</p>
          </div>
          <div className="stat-item">
            <h4>Current Value</h4>
            <p className="positive">${growthData[growthData.length - 1].value.toLocaleString()}</p>
          </div>
          <div className="stat-item">
            <h4>Total Return</h4>
            <p className="positive">+{growthData[growthData.length - 1].growth}%</p>
          </div>
        </div>
      </div>
      
      <div className="charts-container-vertical">
        <div className="chart-box">
          <h4>Portfolio Growth Trajectory (2020-2025)</h4>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <LineChart 
                data={growthData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="year" 
                  tick={{ fill: '#666' }}
                />
                <YAxis 
                  tick={{ fill: '#666' }}
                  tickFormatter={(value) => `$${(value/1000).toFixed(0)}K`}
                />
                <Tooltip content={<CustomLineTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name="Portfolio Value"
                  stroke="#8884d8" 
                  strokeWidth={3}
                  dot={{ r: 6, fill: '#8884d8' }}
                  activeDot={{ r: 8, fill: '#8884d8', stroke: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-box pie-chart-container">
          <h4>Investment Allocation</h4>
          <div className="pie-chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={100}
                  outerRadius={140}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke="white"
                      strokeWidth={2}
                      style={{
                        filter: activeIndex === index ? 'url(#glow)' : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Vertical company blocks */}
          <div className="company-blocks">
            {startupData.map((company, index) => (
              <div key={index} className="company-block">
                <div className="company-name">
                  <span 
                    className="company-dot" 
                    style={{ backgroundColor: company.color }}
                  ></span>
                  {company.name}
                </div>
                <div className="company-value">
                  ${company.value.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>

      
    </div>
  );
};

export default InvestedStartups;