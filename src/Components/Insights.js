import React from "react";
import { Link } from "react-router-dom";

const Insights = () => {
  return (
    <div className="container">
      <header>
        <h1>Investment Insights</h1>
        <nav>
          <Link to="/">Back to Home</Link>
        </nav>
      </header>
      <div className="content">
        <p>Insights and analytics about your investments will appear here.</p>
      </div>
    </div>
  );
};

export default Insights;
