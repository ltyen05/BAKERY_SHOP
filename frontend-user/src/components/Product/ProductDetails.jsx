import { useState } from "react";
import { Row, Col, Button } from "antd";
import { Link } from "react-router-dom";
import SourDough from "../../assets/Sourdough.jpg";
import Product from "./Product";
import Review from "../reviewComments/review";
import { Pagination, Rate } from "antd";
export default function ProductDetail() {
  const [quantity, setQuantity] = useState(1);
  const reviews = Array.from({ length: 18 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    content: `This is review number ${i + 1}.`,
    rating: 4,
  }));

  const pageSize = 5; // mỗi trang 5 cái
  const [page, setPage] = useState(1);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const currentReviews = reviews.slice(start, end);
  return (
    <div>
      {/* ------------------------------------------------ */}
      <Row
        style={{
          maxWidth: "1150px",
          width: "90%",
          margin: "auto",
        }}
        justify="space-between"
        align="middle"
      >
        <Col xs={24} lg={11}>
          <img
            src={SourDough}
            alt="Sourdough"
            style={{
              borderRadius: "16px",
              width: "100%",
              maxWidth: "530px",
              objectFit: "cover",
              aspectRatio: "1 / 1",
              boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
            }}
            className="mb-3"
          />
        </Col>
        <Col xs={24} lg={11} style={{ textAlign: "start" }}>
          <div>
            <h1 style={{ fontSize: "38px" }} className="mb-3">
              SOURDOUGH
            </h1>
            <p style={{ fontSize: "22px", fontWeight: "500" }}>
              580.000<span style={{ fontSize: "16px" }}>đ</span> <br />
              <p style={{ fontSize: "14px", opacity: 0.6, fontWeight: "300" }}>
                (Giá chưa bao gồm thuế VAT)
              </p>
            </p>
            <p
              style={{ fontSize: "16px", color: "#61432b" }}
              className="mt-6 mb-6"
            >
              Bánh mì Sourdough được làm thủ công từ men tự nhiên, nướng trong
              lò gạch để giữ vỏ giòn – ruột mềm, hương vị chua nhẹ đặc trưng.
            </p>
            <div
              style={{
                justifyContent: "start",

                gap: "10px",
              }}
              className="fl-center mb-6"
            >
              <p style={{ fontSize: "16px" }}>Số lượng: </p>
              <div
                style={{
                  border: "2px solid  #61432b",
                  borderRadius: "14px",
                  overflow: "hidden",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={() => setQuantity((quantity) => quantity - 1)}
                  style={{
                    width: "30px",
                    height: "30px",
                    background: "transparent",
                    fontSize: "20px",
                    cursor: "pointer",
                    border: "none",
                    color: "#4E3E2A",
                  }}
                  className="hover-grey fl-center"
                >
                  −
                </button>

                <div
                  style={{
                    width: "30px",
                    textAlign: "center",
                    fontSize: "16px",
                    fontWeight: 400,
                    color: "#4E3E2A",
                  }}
                >
                  {quantity}
                </div>

                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: "30px",
                    height: "30px",
                    border: "none",
                    background: "transparent",
                    fontSize: "20px",
                    cursor: "pointer",
                    color: "#4E3E2A",
                  }}
                  className="hover-grey"
                >
                  +
                </button>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                width: "90%",
                maxWidth: "400px",
              }}
              className="mb-6"
            >
              <button
                style={{
                  flex: 1,
                  padding: "14px 0",
                  border: "2px solid  #61432b",
                  borderTopLeftRadius: "18px",
                  borderBottomLeftRadius: "18px",
                  background: "transparent",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
                className="btn-primary"
              >
                THÊM VÀO GIỎ HÀNG
              </button>

              <button
                style={{
                  flex: 1,
                  padding: "14px 0",
                  border: "2px solid  #61432b",
                  borderTopRightRadius: "18px",
                  borderBottomRightRadius: "18px",
                  background: "transparent",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
                className="btn-primary "
              >
                MUA NGAY
              </button>
            </div>
          </div>
        </Col>
      </Row>
      {/* ------------------------------------------------ */}
      <div
        className="mt-18"
        style={{ maxWidth: "1300px", width: "100%", margin: "0 auto" }}
      >
        <div style={{ justifyContent: "start" }} className="fl-center mb-6">
          <p
            style={{
              fontSize: "20px",
              fontWeight: "600",
              marginRight: "20px",
            }}
          >
            Đánh giá sản phẩm:
          </p>
          <Rate
            allowHalf
            disabled
            value={4.0}
            style={{ marginRight: "40px" }}
          ></Rate>
          <p>
            4.0
            <span
              style={{
                fontSize: "14px",
                fontWeight: "200px",
                margin: "0px 5px",
                opacity: "0.6",
              }}
            >
              ({reviews.length})
            </span>
          </p>
        </div>
        <div style={{ width: "90%", maxWidth: "700px" }}>
          {/* Hiển thị 5 review của trang hiện tại */}
          <div style={{ height: "580px" }}>
            {currentReviews.map((review) => (
              <div className="mb-3">
                <Review
                  key={review.id}
                  name={review.name}
                  content={review.content}
                  rating={review.rating}
                />
              </div>
            ))}
          </div>

          {/* Pagination căn giữa */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Pagination
              current={page}
              total={reviews.length}
              align="center"
              pageSize={pageSize}
              onChange={(p) => setPage(p)}
            />
          </div>
        </div>
      </div>
      {/* ----------------------------------------------------------------------------- */}
      <div className="mt-18">
        <Row>
          <Col span={24} className="fl-center mt-3">
            <h1>Sản phẩm khác</h1>
          </Col>
        </Row>
        <div>
          <Row align="top" justify="center">
            <Col>
              <Product productName={"Bánh kem chesse"} price={"120000"} />
            </Col>
            <Col>
              <Product productName={"Sourdough"} price={"120000"} />
            </Col>
            <Col>
              <Product productName={"Sourdough"} price={"120000"} />
            </Col>
          </Row>
        </div>
        <div className="mt-6 mb-18">
          <Link to="/menu">
            <Button
              style={{
                borderRadius: "25px",
                height: "50px",
              }}
              className="mb-3 btn btn-primary"
            >
              Xem thêm &gt;
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
