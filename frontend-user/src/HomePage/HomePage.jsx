import { Row, Col, Button } from "antd";
import Product from "../components/Product/Product";
import { Link } from "react-router-dom";
import "./homePage.css";
import { useEffect } from "react";
function HomePage({ user }) {
  // const [topProducts, setTopProducts] = useState([]);

  // useEffect(() => {
  //   // Hàm tải dữ liệu
  //   const fetchData = async () => {
  //     try {
  //       const res = await fetch("http://localhost:8000/api/products/top5");
  //       const data = await res.json();
  //       setTopProducts(data);
  //     } catch (err) {
  //       console.error("Lỗi khi tải top sản phẩm:", err);
  //     }
  //   };

  //   // Gọi ngay lần đầu
  //   fetchData();

  //   // Cập nhật mỗi 1 giây
  //   const interval = setInterval(fetchData, 1000);

  //   // Dọn dẹp khi component unmount
  //   return () => clearInterval(interval);
  // }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    const elementsToAnimate = document.querySelectorAll(".animate-on-scroll");

    elementsToAnimate.forEach((el) => observer.observe(el));

    return () => {
      elementsToAnimate.forEach((el) => observer.unobserve(el));
    };
  }, []);
  return (
    <div>
      {/* <h1>Welcome to the Home Page</h1>
      <p>This is the main landing page of the application.</p>
      {user ? (
        <h2 className="text-2xl">Chào mừng, {user}!</h2>
      ) : (
        <p className="text-gray-600">Bạn chưa đăng nhập.</p>
      )} */}

      <div className="cham"></div>
      <div>
        <Row>
          <Col span={24} className="fl-center mt-3">
            <h1>Sản phẩm bán chạy</h1>
          </Col>
        </Row>
        <div>
          <Row align="top" justify="center">
            <Col
              className="box animate-on-scroll fade-up "
              style={{ transitionDelay: "0.05s" }}
            >
              <Product productName={"Bánh kem chesse"} price={"120000"} />
            </Col>
            <Col
              className="box animate-on-scroll fade-up "
              style={{ transitionDelay: "0s" }}
            >
              <Product productName={"Sourdough"} price={"120000"} />
            </Col>
            <Col
              className="box animate-on-scroll fade-up "
              style={{ transitionDelay: "0.05s" }}
            >
              <Product productName={"Sourdough"} price={"120000"} />
            </Col>
          </Row>
        </div>
      </div>
      <div>
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
  );
}

export default HomePage;
