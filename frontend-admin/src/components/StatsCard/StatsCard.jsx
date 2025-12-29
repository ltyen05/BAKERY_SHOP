import React from 'react';
import './StatsCard.css';

/**
 * StatsCard Component
 * @param {string} title - Tiêu đề của card (vd: "TOTAL REVENUE")
 * @param {string} value - Giá trị hiển thị (vd: "125.5M")
 * @param {number} change - Phần trăm thay đổi (vd: 12.5 hoặc -3.2)
 * @param {string} period - Khoảng thời gian so sánh (vd: "vs last month")
 * @param {string} color - Màu theme: 'purple', 'pink', 'blue', 'green', 'orange', 'yellow'
 * @param {ReactNode} icon - Icon JSX element
 */
export default function StatsCard({ 
  title, 
  value, 
  change, 
  period = "vs last month",
  color = 'purple', 
  icon 
}) {
  const isPositive = change >= 0;
  const showChange = change !== undefined && change !== null && change !== 0;

  return (
    <div className={`stats-card stats-card-${color}`}>
      {/* Top Border - Gradient */}
      <div className="stats-card-border"></div>
      
      {/* Icon Section */}
      <div className="stats-card-icon">
        {icon}
      </div>
      
      {/* Content Section */}
      <div className="stats-card-content">
        <p className="stats-card-title">{title}</p>
        <h3 className="stats-card-value">{value}</h3>
        {showChange && (
          <div className={`stats-card-change ${isPositive ? 'positive' : 'negative'}`}>
            <span className="change-icon">{isPositive ? '↑' : '↓'}</span>
            <span className="change-value">{Math.abs(change)}%</span>
            <span className="change-period">{period}</span>
          </div>
        )}
      </div>
    </div>
  );
}