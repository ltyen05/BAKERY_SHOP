import React, { useState } from "react";
import { Card, Rate, Input, Button, message } from "antd";

const { TextArea } = Input;

const FeedbackComponent = () => {
  const [ratings, setRatings] = useState({
    store: 0,
    shipper: 0,
    product: 0,
  });
  const [comment, setComment] = useState("");

  const handleRatingChange = (type, value) => {
    setRatings((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleSubmit = () => {
    if (ratings.store === 0 || ratings.shipper === 0 || ratings.product === 0) {
      message.warning("Vui lòng đánh giá đầy đủ các mục!");
      return;
    }

    message.success("Cảm ơn bạn đã đánh giá!");
    console.log("Ratings:", ratings);
    console.log("Comment:", comment);

    // Reset form
    setRatings({
      store: 0,
      shipper: 0,
      product: 0,
    });
    setComment("");
  };

  return (
    <div
      style={{
        backgroundColor: "transparent",
        textAlign: "center",
        maxWidth: 500,
        width: "100%",
        borderRadius: 8,
        flexDirection: "column",
      }}
      className="fl-center"
    >
      <h2
        style={{
          fontSize: 24,
          fontWeight: 600,
        }}
        className="mb-6 mt-3"
      >
        Đánh giá đơn hàng
      </h2>

      <div style={{ marginBottom: 24, width: "100%" }}>
        <div
          style={{
            justifyContent: "space-between",
          }}
          className="fl-center mb-3"
        >
          <span style={{ fontSize: 14 }}>Đánh giá về cửa hàng</span>
          <Rate
            value={ratings.store}
            onChange={(value) => handleRatingChange("store", value)}
            style={{ fontSize: 24 }}
          />
        </div>

        <div
          style={{
            justifyContent: "space-between",
          }}
          className="fl-center mb-3"
        >
          <span style={{ fontSize: 14, color: "#333" }}>
            Đánh giá về shipper
          </span>
          <Rate
            value={ratings.shipper}
            onChange={(value) => handleRatingChange("shipper", value)}
            style={{ fontSize: 24 }}
          />
        </div>

        <div
          style={{
            justifyContent: "space-between",
          }}
          className="fl-center mb-6"
        >
          <span style={{ fontSize: 14, color: "#333" }}>
            Đánh giá về sản phẩm
          </span>
          <Rate
            value={ratings.product}
            onChange={(value) => handleRatingChange("product", value)}
            style={{ fontSize: 24 }}
          />
        </div>

        <TextArea
          rows={4}
          placeholder="Ghi phản hồi của bạn về sản phẩm tại đây ......"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{
            marginBottom: 24,
            borderRadius: 4,
          }}
        />

        <Button
          type="primary"
          block
          size="large"
          onClick={handleSubmit}
          style={{
            height: 48,
            fontSize: 16,
            fontWeight: 500,
            borderRadius: "8px",
          }}
          className="btn btn-second"
        >
          Thêm bình luận mới
        </Button>
      </div>
    </div>
  );
};

export default FeedbackComponent;
