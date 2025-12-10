import React from "react";
import "./FeedbackOverview.css";
import { FaStar } from "react-icons/fa";

export default function FeedbackOverview() {
  return (
    <div className="overview-container">
      <h2 className="title">Feedback Overview</h2>

      <div className="overview-cards">
        
        <div className="card">
          <h3>Total Reviews</h3>
          <p className="value">350</p>
        </div>

        <div className="card">
          <h3>Average Rating</h3>
          <p className="value rating">
            4.7 <FaStar color="#ffb400" />
          </p>
        </div>

        <div className="card">
          <h3>Positive</h3>
          <p className="value green">89%</p>
        </div>

        <div className="card">
          <h3>Negative</h3>
          <p className="value red">11%</p>
        </div>
      </div>

      {/* Chart placeholder */}
      <div className="chart-box">
        <h3>Monthly Review Chart</h3>
        <p>(Chart Placeholder — you can use Chart.js)</p>
      </div>

    </div>
  );
}
