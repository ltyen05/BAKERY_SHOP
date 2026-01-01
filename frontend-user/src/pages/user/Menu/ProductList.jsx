import { useEffect, useState } from "react";
import { Row, Col, Skeleton, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import Product from "../../../components/Product/Product";
import { useLocation } from "react-router-dom";
import { useOrder } from "../../../context/OrderContext";
import { useAuth } from "../../../context/AuthContext";
const categoryMap = {
  bread: 1,
  cookie: 2,
  pastry: 3,
};

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
  const { user } = useAuth();
  const { addToCart, addingToCart } = useOrder();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const location = useLocation();
  const category = location.pathname.split("/").pop();
  const category_id = categoryMap[category];
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

  useEffect(() => {
    if (!category_id) return;

    const fetchProducts = async () => {
      setLoading(true);
      const startTime = Date.now(); // Lưu thời điểm bắt đầu

      try {
        const response = await fetch(
          `http://localhost:5000/api/product/filter?category_id=${category_id}`
        );
        if (!response.ok) throw new Error("Lỗi tải dữ liệu");
        const data = await response.json();

        // Tính thời gian đã trôi qua
        const elapsedTime = Date.now() - startTime;
        const minimumLoadTime = 1000; // 1.5 giây tối thiểu
        const remainingTime = Math.max(0, minimumLoadTime - elapsedTime);

        // Đợi thêm nếu load quá nhanh
        setTimeout(() => {
          setProducts(data);
          setLoading(false);
        }, remainingTime);
      } catch (error) {
        console.error(error);
        message.error("Không thể tải danh sách sản phẩm!");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category_id]);

  return (
    <div>
      <Row justify="center" align="top">
        {loading
          ? // Hiện 8 skeleton giả khi đang load
            Array(8)
              .fill(0)
              .map((_, index) => (
                <Col key={`skeleton-${index}`}>
                  <ProductSkeleton />
                </Col>
              ))
          : // Hiện sản phẩm thật khi load xong
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
            ))}
      </Row>
    </div>
  );
}
