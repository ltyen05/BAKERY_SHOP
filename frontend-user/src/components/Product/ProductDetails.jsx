import { useState } from "react";
import { Row, Col, Button } from "antd";
import { Link } from "react-router-dom";
import Product from "./Product";
import Review from "../reviewComments/review";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Pagination, Rate } from "antd";
import { useProduct } from "../../context/ProductContext";
import { useOrder } from "../../context/OrderContext";
export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { setCurrentProduct } = useProduct();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!productId) return;

    fetch(`http://localhost:5000/api/product/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setCurrentProduct(data);
      })
      .catch((err) => console.error(err));
  }, [productId]);
  if (!product) {
    return <div style={{ textAlign: "center" }}>Đang tải sản phẩm...</div>;
  }
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
        className="mt-6"
      >
        <Col xs={24} lg={11}>
          <img
            src={product?.image}
            alt={product?.name}
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
              {(product?.name).toUpperCase()}
            </h1>
            <p style={{ fontSize: "22px", fontWeight: "500" }}>
              {(product?.price).toLocaleString("vi-VN")}
              <span style={{ fontSize: "16px" }}>đ</span> <br />
              <p style={{ fontSize: "14px", opacity: 0.6, fontWeight: "300" }}>
                (Giá chưa bao gồm thuế VAT)
              </p>
            </p>
            <p
              style={{
                fontSize: "16px",
                color: "#61432b",
                textAlign: "justify",
              }}
              className="mt-6 mb-6"
            >
              {product?.description}
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
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
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
                onClick={() => {
                  const products = [{ ...product, quantity }];
                  const totalPrice = product?.price * quantity;
                  navigate("/payment", {
                    state: {
                      products,
                      totalPrice,
                    },
                  });
                }}
              >
                MUA NGAY
              </button>
            </div>
          </div>
        </Col>
      </Row>
      {/* ------------------------------------------------ */}
      <div
        className="mt-24 mb-24"
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
            value={product?.rating}
            style={{ marginRight: "40px" }}
          ></Rate>
          <p>{product?.rating}</p>
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
