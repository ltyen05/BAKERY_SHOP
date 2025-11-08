import { React, useEffect } from "react";
import { Row, Col } from "antd";
import aboutUs1 from "../assets/aboutUs1.jpg";
import "./aboutUs.css";

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
  }, []); // [] đảm bảo hook này chỉ chạy 1 LẦN DUY NHẤT
  // ===== KẾT THÚC LOGIC ANIMATION =====
  return (
    <div>
      <div style={{ margin: "auto", width: "90%", textAlign: "start" }}>
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
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </Col>
        </Row>
        {/**/}
      </div>
      <div className="vision mission-vision">
        <Row gutter={30} align="top">
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
                src={aboutUs1}
                alt="About HUS Bakery"
                style={{
                  width: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
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
              <h1 className="mb-3" style={{ fontSize: "32px" }}>
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
      <div className="mission mission-vision">
        <Row gutter={30} align="bottom">
          {/* Sứ mệnh */}

          <Col
            className="text-col animate-on-scroll fade-up"
            xs={24}
            sm={24}
            md={12}
            xl={12}
          >
            <div>
              <h1 className="mb-3" style={{ fontSize: "32px" }}>
                Sứ mệnh
              </h1>
              <div className="body">
                <p style={{ textAlign: "justify", fontSize: "16px" }}>
                  Với quyết tâm “tái định vị” vị thế của chiếc bánh sinh nhật
                  trên bàn tiệc, chúng tôi nỗ lực sáng tạo nên những hương vị
                  khác biệt, độc đáo và ngon miệng để mang đến những trải nghiệm
                  tuyệt vời nhất cho khách hàng; đồng thời xây dựng chuẩn mực
                  mới của hương vị, đó là: không chỉ ngon mà còn chạm đến cảm
                  xúc.
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
                src={aboutUs1}
                alt="About HUS Bakery"
                style={{
                  width: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default AboutUs;
