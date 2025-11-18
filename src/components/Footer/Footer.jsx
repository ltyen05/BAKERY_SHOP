import React from "react";
import "./Footer.css"; // nếu bạn có CSS riêng
import logo from "../../assets/bakes.svg";
import fb from "../../assets/fb.svg";
import ig from "../../assets/ig.svg";
import x from "../../assets/x.svg";
import linkedin from "../../assets/linkedin.svg";
import { Row, Col } from "antd";
function Footer() {
  return (
    <div className="main-foot fl-center" style={{ textAlign: "start" }}>
      <Row justify="space-between" className="body-foot">
        <Col xs={11} md={7} xl={5} className="x17527 mb-3">
          <div className="logo" style={{ margin: 0, padding: 0 }}>
            <img src={logo} alt="logo" style={{ width: "65px" }} />
          </div>
          <p className="foot-para-text">
            Need to help for your dream Career? Trust us. With Lesson, study
            becomes a lot easier with us.
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
                <a href="#!" className="foot-para-text">
                  About Us
                </a>
              </li>
              <li>
                <a href="#!" className="foot-para-text">
                  Features
                </a>
              </li>
              <li>
                <a href="#!" className="foot-para-text">
                  Our Pricing
                </a>
              </li>
              <li>
                <a href="#!" className="foot-para-text">
                  Latest News
                </a>
              </li>
            </ul>
          </div>
        </Col>

        <Col xs={10} md={7} xl={5} className="mb-3">
          <h4 className="h4-level">Support</h4>
          <div className="part">
            <ul>
              <li>
                <a href="#!" className="foot-para-text">
                  FAQ’s
                </a>
              </li>
              <li>
                <a href="#!" className="foot-para-text">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#!" className="foot-para-text">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#!" className="foot-para-text">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </Col>

        <Col xs={11} md={7} xl={5} className="mb-3">
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

        <p className="copyright">
          Copyright ©2022 webdesign.gdn All rights reserved
        </p>
      </Row>

      {/* <p className="copyright">
        Copyright ©2022 webdesign.gdn All rights reserved
      </p> */}
    </div>
  );
}

export default Footer;
