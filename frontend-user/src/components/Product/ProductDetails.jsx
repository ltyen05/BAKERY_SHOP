import { useState } from "react";
import { Row, Col, Button } from "antd";
import { Link } from "react-router-dom";
import Product from "./Product";
import Review from "../reviewComments/review";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Pagination, Rate, Skeleton, Space, Card } from "antd";
import { useProduct } from "../../context/ProductContext";
import { useOrder } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
const ProductDetailSkeleton = () => {
  return (
    <Row
      style={{
        maxWidth: "1150px",
        width: "90%",
        margin: "auto",
        minHeight: "530px",
      }}
      justify="space-between"
      align="middle"
      className="mt-6 mb-24"
    >
      {/* IMAGE */}
      <Col xs={24} lg={11} className="mb-3">
        <Skeleton.Image
          active
          style={{
            width: "100%",
            maxWidth: "530px",

            aspectRatio: "1 / 1",
            borderRadius: "16px",
          }}
        />
      </Col>

      {/* INFO */}
      <Col xs={24} lg={11}>
        <Skeleton.Input
          active
          size="large"
          style={{ width: "80%", height: 48 }}
          className="mb-3"
        />

        <Skeleton
          active
          paragraph={{ rows: 4 }}
          title={false}
          className="mt-6 mb-6"
        />

        {/* QUANTITY */}
        <div className="fl-center mb-6" style={{ gap: "10px" }}>
          <Skeleton.Input active style={{ width: 80 }} />
          <Skeleton.Input active style={{ width: 120 }} />
        </div>

        {/* BUTTONS */}
        <div style={{ display: "flex", gap: "8px" }}>
          <Skeleton.Button active style={{ width: "50%", height: 48 }} />
          <Skeleton.Button active style={{ width: "50%", height: 48 }} />
        </div>
      </Col>
    </Row>
  );
};

export default function ProductDetail() {
  const [loading, setLoading] = useState(true);
  const [minDelayDone, setMinDelayDone] = useState(false);
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, addingToCart } = useOrder();
  const [quantity, setQuantity] = useState(1);
  const { setCurrentProduct } = useProduct();
  const [product, setProduct] = useState(null);
  const { topProducts } = useProduct();
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinDelayDone(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/product/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setCurrentProduct(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);

  const handleAddToCart = async (product, quantity = 1) => {
    // Kiểm tra user
    if (!user) {
      alert("Bạn cần đăng nhập.");
      return;
    }

    if (user.role !== "customer") {
      alert("Chỉ khách hàng mới có thể thêm sản phẩm vào giỏ hàng.");
      return;
    }

    try {
      await addToCart(product, quantity);
      console.log(`Đã thêm "${product.name}" vào giỏ hàng!`);
    } catch (err) {
      console.log(err.message || "Không thể thêm vào giỏ hàng");
    }
  };

  if (loading || !minDelayDone) {
    return <ProductDetailSkeleton />;
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
              maxWidth: "530px",
              objectFit: "cover",
              aspectRatio: "1 / 1",
              boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
            }}
            className="mb-3 w100"
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
              <span
                style={{ fontSize: "14px", opacity: 0.6, fontWeight: "300" }}
              >
                (Giá chưa bao gồm thuế VAT)
              </span>
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
                onClick={() => handleAddToCart(product, quantity)}
                disabled={addingToCart}
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
        className="mt-12 mb-24 w100"
        style={{ maxWidth: "1300px", margin: "0 auto" }}
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
            {topProducts.map((item) => (
              <Col key={item?.product_id}>
                <Product
                  product_id={item?.product_id}
                  product_name={item?.name}
                  price={item?.price}
                  image={item?.image}
                  rating={item?.rating}
                  onAddToCart={handleAddToCart} // ⭐ Truyền handler mới
                  isAddingToCart={addingToCart} // ⭐ Truyền loading state
                />
              </Col>
            ))}
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
