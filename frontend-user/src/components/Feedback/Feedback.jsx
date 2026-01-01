import React, { useState } from "react";
import { Rate, Button, message } from "antd";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

const FeedbackComponent = ({ order_id }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [ratings, setRatings] = useState({
    store: 0,
    shipper: 0,
    product: 0,
  });

  const handleRatingChange = (type, value) => {
    setRatings((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleSubmit = async () => {
    if (ratings.store === 0 || ratings.shipper === 0 || ratings.product === 0) {
      message.warning("Vui lòng đánh giá đầy đủ các mục!");
      return;
    }

    try {
      // hoặc từ context/state nếu bạn dùng
      const res = await fetchWithAuth(
        "http://localhost:5000/api/feedback/add",
        {
          method: "POST",
          body: JSON.stringify({
            order_id, // cần truyền prop order_id vào component
            rating_product: ratings.product,
            rating_branch: ratings.store,
            rating_shipper: ratings.shipper,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        messageApi.success(data.message || "Cảm ơn bạn đã đánh giá!");
        // Reset form
        setRatings({ store: 0, shipper: 0, product: 0 });
      } else {
        messageApi.error(data.message || "Có lỗi xảy ra, thử lại sau.");
      }
    } catch (error) {
      console.error(error);
      messageApi.error("Không thể kết nối server!");
    }
  };

  return (
    <>
      {contextHolder}
      <div
        style={{
          backgroundColor: "transparent",
          textAlign: "center",
          maxWidth: 500,
          borderRadius: 8,
          flexDirection: "column",
        }}
        className="fl-center w100"
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
    </>
  );
};

export default FeedbackComponent;
