import { Row, Col, Button } from "antd";
import logo from "../../assets/logo-noText.svg";
import { RightOutlined } from "@ant-design/icons";
export default function Voucher({
  discount = 15,
  minOrder = 0,
  expiryDate = "10/10/2025",
}) {
  return (
    <div style={{ textAlign: "start", width: "360px" }}>
      <Row>
        <Col
          span={6}
          style={{ backgroundColor: " #2e2100" }}
          className="fl-center"
        >
          <img src={logo} alt="" style={{ height: "36px" }} />
        </Col>
        <Col
          span={18}
          style={{
            padding: "6px 10px",
          }}
        >
          <Row>
            <p style={{ fontSize: "16px" }}>
              Giảm {discount}% cho đơn từ {minOrder}đ
            </p>
          </Row>
          <Row align="bottom" className="mt-3">
            <Col span={12}>HSD: {expiryDate}</Col>
            <Col span={12} style={{ textAlign: "end" }}>
              <button
                style={{
                  textDecoration: "underline",
                  padding: "0",
                  fontWeight: "400",
                  fontFamily: "inherit",
                }}
                className="out-line"
              >
                Dùng ngay <RightOutlined />
              </button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
