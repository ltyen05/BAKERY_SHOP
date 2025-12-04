import React from "react";
import "./review.css";
import { Rate } from "antd";
function Review({ avatar, name, rating, content }) {
  return (
    <div className="review-card">
      <img
        src="https://i.pravatar.cc/150?img=5"
        alt={name}
        className="review-avatar"
      />

      <div className="review-content">
        <div className="review-header">
          <h4 className="review-name">{name}</h4>
          <div className="review-stars">
            <Rate allowHalf value={rating} disabled></Rate>
          </div>
        </div>
        <p className="review-text">{content}</p>
      </div>
    </div>
  );
}

export default Review;
