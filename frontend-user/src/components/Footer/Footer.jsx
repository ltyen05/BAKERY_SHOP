import React from "react";
import "./Footer.css"; // nếu bạn có CSS riêng
import logo from "../../assets/logo-noText.svg";
import fb from "../../assets/fb.svg";
import ig from "../../assets/ig.svg";
import x from "../../assets/x.svg";
import linkedin from "../../assets/linkedin.svg";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <div className="main-foot fl-center" style={{ textAlign: "start" }}>
      <Row justify="space-between" className="body-foot">
        <Col xs={11} md={7} xl={5} className="x17527 mb-3">
          <div className="logo" style={{ margin: 0, padding: 0 }}>
            <img src={logo} alt="logo" style={{ width: "65px" }} />
          </div>
          <p className="foot-para-text">
            Tại Hus Bakery, từng chiếc bánh được chăm chút để biến mỗi ngày của
            bạn trở nên ngọt ngào và trọn vẹn hơn.
          </p>
          <div className="social-list">
            <ul>
              <li>
                <a href="#">
                  <img src={x} alt="twitter" />
                </a>
              </li>
              <li>
                <a href="#">
                  <img src={fb} alt="facebook" />
                </a>
              </li>
              <li>
                <a href="#">
                  <img src={linkedin} alt="linkedin" />
                </a>
              </li>
              <li>
                <a href="#">
                  <img src={ig} alt="instagram" />
                </a>
              </li>
            </ul>
          </div>
        </Col>

        <Col xs={10} md={7} xl={5} className="mb-3">
          <h4 className="h4-level">Company</h4>
          <div className="part">
            <ul>
              <li>
                <Link to="/aboutUs" className="foot-para-text">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="foot-para-text">
                  Các cơ sở
                </Link>
              </li>
              <li>
                <a href="/menu" className="foot-para-text">
                  Menu
                </a>
              </li>
            </ul>
          </div>
        </Col>

        <Col xs={11} md={7} xl={5} className="mb-12">
          <h4 className="h4-level">Address</h4>
          <div className="part">
            <ul>
              <li>
                <a href="#!" className="foot-para-text">
                  <span style={{ fontWeight: 600, color: "white" }}>
                    Địa chỉ
                  </span>
                  : Số 334 Nguyễn Trãi, Phường Thanh Xuân, Hà Nôi
                </a>
              </li>
              <li>
                <a href="#!" className="foot-para-text">
                  <span style={{ fontWeight: 600, color: "white" }}>Email</span>
                  : husbakery@hus.edu.vn
                </a>
              </li>
              <li>
                <a href="#!" className="foot-para-text">
                  <span style={{ fontWeight: 600, color: "white" }}>Phone</span>
                  : 0966456733
                </a>
              </li>
            </ul>
          </div>
        </Col>

        <p className="copyright pt-3">
          Copyright © Nguyễn Tiến Lưỡng - Nguyễn Bảo Thạch - Lê Nguyễn Tố Uyên -
          Lê Thị Yến
        </p>
      </Row>
    </div>
  );
}

export default Footer;
