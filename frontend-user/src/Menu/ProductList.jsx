import { useEffect, useState } from "react";
import { Row, Col, Spin, message } from "antd";
import { LoadingOutlined, CloseOutlined } from "@ant-design/icons";
// Import component Product bạn vừa viết
import Product from "../components/Product/Product";
import { useLocation } from "react-router-dom";
import ProductDetail from "../components/Product/ProductDetails";
import FeedbackComponent from "../components/Feedback/Feedback";

const categoryMap = {
  bread: 1,
  cookie: 2,
  pastry: 3,
};
export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const location = useLocation();
  const category = location.pathname.split("/").pop();
  const category_id = categoryMap[category];
  useEffect(() => {
    if (!category_id) return; // ✅ CHỐT LỖI

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/product/filter?category_id=${category_id}`
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
  }, [category_id]);

  return (
    <div style={{ border: "1px solid" }}>
      {loading ? (
        <div className="fl-center" style={{ minHeight: "200px" }}>
          <Spin indicator={<LoadingOutlined spin />} />
        </div>
      ) : (
        // Dùng Row/Col của Antd để chia cột (Responsive)
        <Row justify="center" align="top" style={{ border: "1px solid red" }}>
          {products.map((item) => (
            // xs={24}: Điện thoại 1 cột
            // sm={12}: Tablet nhỏ 2 cột
            // md={8}: Tablet to 3 cột
            // lg={6}: Máy tính 4 cột
            <Col key={item?.product_id}>
              {/* Truyền dữ liệu từ API vào Component Product */}
              <Product
                product_id={item?.product_id} // DB trả về 'id' -> truyền vào prop 'productId'
                productName={item?.name} // DB trả về 'name' -> truyền vào prop 'productName'
                price={item?.price} // DB trả về 'price'
                image={item?.image} // DB trả về 'image_url' -> truyền vào prop 'image'
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
