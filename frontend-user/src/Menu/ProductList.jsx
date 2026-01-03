import { useEffect, useState } from "react";
import { Row, Col, Spin, message } from "antd";
import { LoadingOutlined, CloseOutlined } from "@ant-design/icons";
// Import component Product bạn vừa viết
import Product from "../components/Product/Product";
import ProductDetail from "../components/Product/ProductDetails";
import FeedbackComponent from "../components/Feedback/Feedback";
export default function ProductList({ category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Gọi API Flask
        const response = await fetch(
          `http://127.0.0.1:5000/api/products?category=${category}`
        );
        if (!response.ok) throw new Error("Lỗi tải dữ liệu");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
        message.error("Không thể tải danh sách sản phẩm!");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  return (
    <div className="container py-4" style={{ border: "1px solid" }}>
      {loading ? (
        <div className="fl-center" style={{ minHeight: "200px" }}>
          <Spin indicator={<LoadingOutlined spin />} />
        </div>
      ) : (
        // Dùng Row/Col của Antd để chia cột (Responsive)
        <Row gutter={[24, 24]}>
          {products.map((item) => (
            // xs={24}: Điện thoại 1 cột
            // sm={12}: Tablet nhỏ 2 cột
            // md={8}: Tablet to 3 cột
            // lg={6}: Máy tính 4 cột
            <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
              {/* Truyền dữ liệu từ API vào Component Product */}
              <Product
                productName={item.name} // DB trả về 'name' -> truyền vào prop 'productName'
                price={item.price} // DB trả về 'price'
                image={item.image_url} // DB trả về 'image_url' -> truyền vào prop 'image'
              />
            </Col>
          ))}
        </Row>
      )}
      <ProductDetail />
      <button onClick={() => setShowFeedback(true)}>Đánh giá ngay</button>
      {showFeedback && (
        <div className="fl-center showUp">
          <div
            style={{
              width: "95%",
              maxWidth: "500px",
              backgroundColor: " #fdfbf5",
              maxHeight: "90%",
              borderRadius: "8px",
              flexDirection: "column",
              position: "relative",
            }}
            className="fl-center"
          >
            <div
              className="scrollbar"
              style={{
                width: "100%",
                maxHeight: "100%",
                maxWidth: "450px",
                overflowY: "auto",
                padding: "20px",
              }}
            >
              <button
                onClick={() => setShowFeedback(false)}
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",

                  fontSize: "15px",
                }}
                className="out-line"
              >
                <CloseOutlined />
              </button>

              <FeedbackComponent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
