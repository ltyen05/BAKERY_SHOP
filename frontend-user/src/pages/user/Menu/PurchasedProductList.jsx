import { useEffect, useState } from "react";
import { Row, Col, Skeleton, message, Empty } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import Product from "../../../components/Product/Product";
import { useLocation } from "react-router-dom";
import ProductDetail from "../../../components/Product/ProductDetails";
import FeedbackComponent from "../../../components/Feedback/Feedback";
import { useOrder } from "../../../context/OrderContext";
import { useAuth } from "../../../context/AuthContext";
import { useAccount } from "../../../context/AccountContext";

// Component Skeleton giống Product thật
const ProductSkeleton = () => (
  <div
    style={{
      width: "300px",
      margin: "30px",
      border: "1px solid #f0f0f0",
      borderRadius: "12px",
    }}
  >
    <Skeleton.Image
      active
      style={{ width: "300px", height: "250px", marginBottom: "12px" }}
    />
    <Skeleton active paragraph={{ rows: 2 }} />
  </div>
);

export default function ProductList() {
  const { messageApi, contextHolder } = message.useMessage();
  const { user } = useAuth();
  const { addToCart, addingToCart } = useOrder();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const category = location.pathname.split("/").pop();
  const { products_bought } = useAccount();

  useEffect(() => {
    const fetchBoughtProducts = async () => {
      if (!user || user.role !== "customer") return;

      setLoading(true);
      const startTime = Date.now();

      try {
        const data = await products_bought();
        const elapsedTime = Date.now() - startTime;
        const minimumLoadTime = 1000;
        const remainingTime = Math.max(0, minimumLoadTime - elapsedTime);

        setTimeout(() => {
          setProducts(data);
          setLoading(false); // chỉ set loading sau delay
        }, remainingTime);
      } catch (err) {
        console.error("Lỗi fetch bought products:", err);
        messageApi.error("Không thể lấy sản phẩm đã mua");

        // nếu lỗi, vẫn hiện skeleton ít nhất 1s
        const elapsedTime = Date.now() - startTime;
        const minimumLoadTime = 1000;
        const remainingTime = Math.max(0, minimumLoadTime - elapsedTime);
        setTimeout(() => {
          setProducts([]);
          setLoading(false);
        }, remainingTime);
      }
    };

    fetchBoughtProducts();
  }, [user, products_bought]);

  const handleAddToCart = async (product) => {
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
      await addToCart(product, 1);
      console.log(`Đã thêm "${product.product_name}" vào giỏ hàng!`);
    } catch (err) {
      console.log(err.message || "Không thể thêm vào giỏ hàng");
    }
  };

  return (
    <>
      {contextHolder}
      <div>
        <Row justify="center" align="top">
          {loading ? (
            // Hiện 8 skeleton giả khi đang load
            Array(8)
              .fill(0)
              .map((_, index) => (
                <Col key={`skeleton-${index}`}>
                  <ProductSkeleton />
                </Col>
              ))
          ) : products.length === 0 ? (
            <Empty
              style={{
                textAlign: "center",
                marginTop: "50px",
                fontSize: "18px",
              }}
            >
              Bạn chưa mua sản phẩm nào
            </Empty>
          ) : (
            // Hiện sản phẩm thật khi load xong
            products.map((item) => (
              <Col key={item?.product_id}>
                <Product
                  product_id={item?.product_id}
                  product_name={item?.name}
                  price={item?.price}
                  image={item?.image}
                  rating={item?.rating}
                  onAddToCart={handleAddToCart}
                  isAddingToCart={addingToCart}
                />
              </Col>
            ))
          )}
        </Row>
      </div>
    </>
  );
}
