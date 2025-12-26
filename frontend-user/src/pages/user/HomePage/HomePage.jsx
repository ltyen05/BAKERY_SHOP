import { Row, Col, Button } from "antd";
import Product from "../components/Product/Product";
import { Link } from "react-router-dom";
import "./homePage.css";
import { useEffect, useState } from "react";
import {
  DoubleRightOutlined,
  HeartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import chef from "../assets/chef.svg";
import award from "../assets/award.svg";
import homePage from "../assets/HomePage.png";
import { useOrder } from "../context/OrderContext";
function HomePage() {
  const [topProducts, setTopProducts] = useState([]);
  const { setProductInCart } = useOrder();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/product/top-selling"
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setTopProducts(data);
        } else {
          setTopProducts([]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (!topProducts.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [topProducts]);
  return (
    <div className="mb-6">
      {/* <h1>Welcome to the Home Page</h1>
      <p>This is the main landing page of the application.</p>
      {user ? (
        <h2 className="text-2xl">Chào mừng, {user}!</h2>
      ) : (
        <p className="text-gray-600">Bạn chưa đăng nhập.</p>
      )} */}

      <div className="cham mb-24"></div>
      <div className="mb-6">
        <Row>
          <Col span={24} className="fl-center mb-3">
            <h1>Sản phẩm bán chạy</h1>
          </Col>
        </Row>
        <div>
          <Row align="top" justify="center">
            {topProducts.map((item) => (
              <Col
                className="animate-on-scroll fade-up "
                style={{ transitionDelay: "0.05s" }}
                key={item?.product_id}
              >
                <Product
                  product_id={item?.product_id} // DB trả về 'id' -> truyền vào prop 'productId'
                  productName={item?.name} // DB trả về 'name' -> truyền vào prop 'productName'
                  price={item?.price} // DB trả về 'price'
                  image={item?.image}
                  onAddToCart={(product) =>
                    setProductInCart((prev) => {
                      console.log("ADD TO CART:", product);
                      const existingProduct = prev.find(
                        (p) => p.product_id === product.product_id
                      );
                      if (existingProduct) {
                        return prev.map((p) =>
                          p.product_id === product.product_id
                            ? { ...p, quantity: p.quantity + 1 }
                            : p
                        );
                      } else {
                        return [...prev, { ...product, quantity: 1 }];
                      }
                    })
                  } // DB trả về 'image_url' -> truyền vào prop 'image'
                />
              </Col>
            ))}
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
            className="mb-12 btn btn-primary"
          >
            Xem thêm &gt;
          </Button>
        </Link>
      </div>

      {/* -------------------------------------------------------------------------------------- */}
      <div
        className="center-box mt-18 "
        style={{ width: "93%", maxWidth: "1430px" }}
      >
        <Row gutter={40}>
          <Col xs={24} xl={14}>
            <Row gutter={10}>
              <Col span={16}>
                <Row style={{ borderRadius: "12px", overflow: "hidden" }}>
                  <img
                    src={homePage}
                    alt=""
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                  />
                </Row>
              </Col>
              <Col span={8}>
                <Row
                  style={{
                    marginTop: "50px",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={homePage}
                    alt=""
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                  />
                </Row>
                <Row
                  style={{
                    marginTop: "10px",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={homePage}
                    alt=""
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                  />
                </Row>
              </Col>
            </Row>
          </Col>
          <Col xs={24} xl={10} className="fl-center">
            <div className="animate-on-scroll fade-right">
              <p
                style={{
                  fontSize: "58px",
                  fontWeight: "700",
                  lineHeight: "58px",
                  textAlign: "center",
                }}
                className="mb-6"
              >
                HUS BAKERY
              </p>
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "500",
                  lineHeight: "32px",
                }}
                className="mb-2"
              >
                Câu chuyện của chúng tôi
              </p>
              <p
                style={{
                  fontSize: "38px",
                  fontWeight: "600",
                  lineHeight: "56px",
                }}
                className="mb-3"
              >
                Bánh tươi mỗi ngày
              </p>
              <p
                style={{
                  fontSize: "18px",
                  textAlign: "justify",
                  lineHeight: "36px",
                  fontWeight: "300",
                }}
              >
                Tại HUS BAKERY, chúng tôi tin rằng một chiếc bánh ngon có thể
                làm ngày của bạn trở nên tuyệt vời hơn. Vì vậy, mỗi chiếc bánh
                đều được chúng tôi chuẩn bị từ những nguyên liệu chọn lọc và
                được làm mới mỗi ngày. HUS BAKERY mang đến những hương vị quen
                thuộc nhưng đầy mới mẻ—ngọt ngào, mềm mại và luôn ấm áp như
                chính tình yêu mà chúng tôi đặt vào từng mẻ bánh.
              </p>
            </div>
          </Col>
        </Row>
      </div>
      {/* ------------------------------------------------------------------------ */}
      {/* ------------------------------------------------------------------------ */}
      <div
        className="container mt-42 mb-36"
        style={{ width: "90%", maxWidth: "1350px" }}
      >
        <div className="fl-center">
          <Row style={{ width: "100%" }} justify="space-between">
            <Col xs={24} md={10} xl={5} className="feature-card">
              <div className="icon-wrapper fl-center icon-wrapper-1">
                <img src={chef} alt="chefhat" style={{ width: "35px" }} />
              </div>
              <h4 className="feature-title">Thợ Làm Bánh Chuyên Nghiệp</h4>
              <p className="feature-text">
                Đội ngũ đầu bếp giàu kinh nghiệm, tay nghề cao với niềm đam mê
                vô hạn
              </p>
            </Col>

            <Col xs={24} md={10} xl={5} className="feature-card">
              <div className="icon-wrapper fl-center icon-wrapper-2">
                <HeartOutlined
                  style={{ fontSize: "33px", color: " rgba(46, 33, 0, 1)" }}
                />
              </div>
              <h4 className="feature-title">Làm Từ Trái Tim</h4>
              <p className="feature-text">
                Mỗi sản phẩm được làm với tình yêu, sự tận tâm và chăm sóc tỉ mỉ
              </p>
            </Col>

            <Col xs={24} md={10} xl={5} className="feature-card">
              <div className="icon-wrapper fl-center icon-wrapper-3">
                <img src={award} alt="award" style={{ width: "40px" }} />
              </div>
              <h4 className="feature-title">Nguyên Liệu Cao Cấp</h4>
              <p className="feature-text">
                100% nguyên liệu tự nhiên, tươi ngon được chọn lọc kỹ càng mỗi
                ngày
              </p>
            </Col>

            <Col xs={24} md={10} xl={5} className="feature-card">
              <div className="icon-wrapper fl-center icon-wrapper-4">
                <UserOutlined
                  style={{ fontSize: "32px", color: " rgba(46, 33, 0, 1)" }}
                />
              </div>
              <h4 className="feature-title">Khách Hàng Hài Lòng</h4>
              <p className="feature-text">
                Hơn 10,000+ khách hàng tin tưởng, yêu mến và luôn quay lại
              </p>
            </Col>
          </Row>
        </div>

        <div className="fl-center mt-36">
          <Row style={{ width: "100%" }} justify="space-around" align="middle">
            <Col
              md={22}
              xl={11}
              className="text-content"
              style={{ textAlign: "center" }}
            >
              <div className="content-badge">VỀ CHÚNG TÔI</div>
              <h3 className="content-title">
                Được Nặn Từ Tình Yêu & Tâm Huyết
              </h3>
              <p className="content-text mb-6">
                Chúng tôi tin rằng những nguyên liệu tươi ngon nhất, kết hợp với
                tay nghề thủ công tinh tế và công thức truyền thống được truyền
                qua nhiều thế hệ, sẽ mang đến cho bạn những trải nghiệm vị giác
                khó quên nhất.
              </p>
              <Link
                to="/aboutUs"
                className="btn btn-primary fl-center"
                style={{ width: "200px" }}
              >
                <p>
                  Khám Phá Thêm <DoubleRightOutlined />
                </p>
              </Link>
            </Col>
            <Col md={22} xl={11} className="image-container">
              <div className="image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1610963812725-3945efe1009f?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Tiệm bánh"
                  className="about-image"
                />
                <div className="image-overlay">
                  <p className="overlay-number">15+</p>
                  <p className="overlay-text">NĂM KINH NGHIỆM</p>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
