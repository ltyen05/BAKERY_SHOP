import { React, useEffect, useState } from "react";
import { Row, Col, Carousel } from "antd";
import aboutUs1 from "../../../assets/aboutUs1.jpg";
import aboutUs2 from "../../../assets/aboutUs2.jpg";
import aboutUs3 from "../../../assets/aboutUs3.jpg";
import aboutUs4 from "../../../assets/aboutUs4.jpg";
import "./aboutUs.css";
const carousel = [
  {
    head: "Tận tâm",
    p: "Nỗ lực hết mình trên hành trình sáng tạo sản phẩm, chu đáo và tận tuỵ trong từng dịch vụ gửi đến khách hàng.",
    img: "https://i.pinimg.com/1200x/ea/63/e3/ea63e36c1d4d7ee8ca0a2040fc80964b.jpg",
  },
  {
    head: "Sáng tạo",
    p: "Không ngừng sáng tạo để biến ý tưởng thành những sản phẩm độc đáo, mang đậm “chất” riêng.",
    img: aboutUs2,
  },
  {
    head: "Trách nhiệm",
    p: "Dốc lòng mang đến những giá trị tốt nhất cho khách hàng thông qua tinh thần trách nhiệm cao độ.",
    img: aboutUs3,
  },
  {
    head: "Đáng tin cậy",
    p: "Chú trọng nâng cao chất lượng sản phẩm, dịch vụ để tạo dựng uy tín thương hiệu và vun đắp sự yêu mến của khách hàng.",
    img: aboutUs4,
  },
];
function AboutUs() {
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

  const [autoplay, setAutoplay] = useState(true);

  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div>
      <div
        style={{
          margin: "auto",
          width: "90%",
          textAlign: "start",
          marginBottom: "150px",
        }}
        className="mt-3"
      >
        <Row gutter={30} align="stretch">
          {/* Cột chứa text */}
          <Col className="text-col" xs={24} sm={24} md={12} xl={16}>
            <div className="section">
              <h1 className="mb-3" style={{ fontSize: "35px" }}>
                Chào mừng bạn đến với HUS BAKERY!
              </h1>
              <div className="body">
                <p
                  className="mb-3"
                  style={{ textAlign: "justify", fontSize: "16px" }}
                >
                  Ngôi nhà nhỏ này được tạo nên từ tình yêu với bánh trái, niềm
                  đam mê hương vị và mong muốn mang đến cho bạn những trải
                  nghiệm ngọt ngào, ấm áp nhất. Mỗi chiếc bánh tại HUS BAKERY là
                  một “đứa con tinh thần” được chăm chút tỉ mỉ, từ nguyên liệu
                  chọn lọc đến hương vị cuối cùng, để bạn cảm nhận được sự tinh
                  tế và tận tâm trong từng chi tiết.
                </p>
                <p
                  className="mb-3"
                  style={{ textAlign: "justify", fontSize: "16px" }}
                >
                  Dù bạn ghé thăm vô tình hay có chủ đích, chúng mình hy vọng
                  bạn sẽ luôn cảm thấy dễ chịu, hân hoan và tìm thấy những hương
                  vị thật êm ái, để nuông chiều bản thân hoặc sẻ chia cùng người
                  thương yêu. Tại HUS BAKERY, mỗi khoảnh khắc thưởng thức bánh
                  đều là một trải nghiệm đặc biệt, nơi hương vị và niềm vui được
                  lan tỏa một cách trọn vẹn.
                </p>
              </div>
            </div>
          </Col>

          {/* Cột chứa ảnh */}
          <Col className="img-col" xs={24} sm={24} md={12} xl={8}>
            <div
              style={{
                height: "100%",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <img
                src={aboutUs1}
                alt="About HUS Bakery"
                style={{
                  height: "100%",
                  objectFit: "cover",
                }}
                className="w100"
              />
            </div>
          </Col>
        </Row>
        {/**/}
      </div>

      {/* --------------------------------------------------------- */}
      <div style={{ marginBottom: "150px" }}>
        <Carousel
          arrows
          autoplay={autoplay}
          autoplaySpeed={4000}
          afterChange={(index) => {
            // Khi đến slide cuối cùng → tắt autoplay
            setActiveIndex(index);
            if (index === carousel.length - 1) {
              setAutoplay(false);
            }
          }}
          dots
          pauseOnHover={false}
        >
          {carousel.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div>
                <div
                  className="css-box-shadow"
                  style={{
                    backgroundImage: `url(${item.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <Row
                    style={{
                      width: "80%",
                      margin: "auto",
                      minHeight: "500px",
                    }}
                  >
                    <Col xs={24} md={12} xl={6} className="fl-center">
                      <div
                        style={{
                          transition: "opacity 0.5s ease, transform 0.5s ease",
                          opacity: isActive ? 1 : 0, // active = slide hiện tại
                          transform: isActive
                            ? "translateX(0)"
                            : "translateX(50px)",
                        }}
                      >
                        {" "}
                        {/* chiếm full height Col */}
                        <h3 className="carousel-head text-32 mb-3">
                          {item.head}
                        </h3>
                        <p className="carousel-text text-16">{item.p}</p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            );
          })}
        </Carousel>
      </div>
      <div className="vision center-box">
        <Row gutter={70} align="top">
          {/* Tầm nhìn */}
          <Col
            className="img-col animate-on-scroll fade-up"
            xs={24}
            sm={24}
            md={12}
            xl={12}
          >
            <div
              style={{
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <img
                src="https://i.pinimg.com/1200x/d3/ab/43/d3ab43d7e87eaa33a9b4a8438338f2ba.jpg"
                alt="About HUS Bakery"
                style={{
                  objectFit: "cover",
                  display: "block",
                }}
                className="w100"
              />
            </div>
          </Col>
          <Col
            className="text-col animate-on-scroll fade-up"
            xs={24}
            sm={24}
            md={12}
            xl={12}
          >
            <div>
              <h1 className="mb-2" style={{ fontSize: "32px" }}>
                Tầm nhìn
              </h1>
              <div className="body">
                <p style={{ textAlign: "justify", fontSize: "16px" }}>
                  Đặt trọn đam mê và tâm huyết trong từng sản phẩm, chúng tôi
                  mong muốn trở thành lựa chọn uy tín hàng đầu của khách hàng,
                  cung cấp những món tráng miệng đặc sắc nhất cho bàn tiệc thêm
                  phần đáng nhớ!
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div style={{ marginBottom: "170px" }} className="mission center-box">
        <Row gutter={70} align="bottom">
          {/* Sứ mệnh */}

          <Col
            className="text-col animate-on-scroll fade-up"
            xs={24}
            sm={24}
            md={12}
            xl={12}
          >
            <div>
              <h1 className="mb-2" style={{ fontSize: "32px" }}>
                Sứ mệnh
              </h1>
              <div className="body">
                <p style={{ textAlign: "justify", fontSize: "16px" }}>
                  Với quyết tâm “tái định vị” vị thế của chiếc bánh trên bàn
                  tiệc, chúng tôi nỗ lực sáng tạo nên những hương vị khác biệt,
                  độc đáo và ngon miệng để mang đến những trải nghiệm tuyệt vời
                  nhất cho khách hàng; đồng thời xây dựng chuẩn mực mới của
                  hương vị, đó là: không chỉ ngon mà còn chạm đến cảm xúc.
                </p>
              </div>
            </div>
          </Col>
          <Col
            className="img-col animate-on-scroll fade-up"
            xs={24}
            sm={24}
            md={12}
            xl={12}
          >
            <div
              style={{
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <img
                src="https://i.pinimg.com/1200x/84/ec/46/84ec46b86bdc48a07a9e1af6ff8b1dac.jpg"
                alt="About HUS Bakery"
                style={{
                  objectFit: "cover",
                  width: "100%",
                  aspectRatio: "1 / 1",
                  display: "block",
                }}
                className="w100"
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default AboutUs;
