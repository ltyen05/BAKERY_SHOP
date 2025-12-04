import { Row, Col, Button } from "antd";
import Product from "../components/Product/Product";
import { Link } from "react-router-dom";
import "./homePage.css";
import { useEffect } from "react";
import homePage from "../assets/HomePage.png";
function HomePage() {
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
    <div className="mb-6">
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
              className="animate-on-scroll fade-up "
              style={{ transitionDelay: "0.05s" }}
            >
              <Product productName={"Bánh kem chesse"} price={"120000"} />
            </Col>
            <Col
              className="animate-on-scroll fade-up "
              style={{ transitionDelay: "0s" }}
            >
              <Product productName={"Sourdough"} price={"120000"} />
            </Col>
            <Col
              className="animate-on-scroll fade-up "
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

      {/* -------------------------------------------------------------------------------------- */}
      <div className="center-box mt-18 mb-18 " style={{ width: "85%" }}>
        <Row gutter={50}>
          <Col span={14}>
            <Row gutter={20}>
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
                    marginTop: "20px",
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
          <Col span={10} className="fl-center">
            <div className="animate-on-scroll fade-left">
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
                được làm mới mỗi ngày. Với bàn tay khéo léo của đội ngũ thợ
                bánh, HUS BAKERY mang đến những hương vị quen thuộc nhưng đầy
                mới mẻ—ngọt ngào, mềm mại và luôn ấm áp như chính tình yêu mà
                chúng tôi đặt vào từng mẻ bánh.
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default HomePage;
