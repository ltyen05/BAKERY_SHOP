import { Row, Col, Button } from "antd";
import logo from "../../assets/logo-noText.svg";
import { RightOutlined } from "@ant-design/icons";
export default function Voucher({
  voucher,
  setSelectedVoucher,
  disabled = false,
}) {
  return (
    <div style={{ textAlign: "start", maxWidth: "360px" }}>
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
            <p
              style={{
                fontSize: "16px",
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            >
              {voucher?.description}
            </p>
          </Row>
          <Row align="bottom" className="mt-3">
            <Col span={12}>HSD: {voucher?.end_date}</Col>
            <Col span={12} style={{ textAlign: "end" }}>
              <Button
                style={{
                  textDecoration: "underline",
                  padding: "0",
                  fontWeight: "400",
                  fontFamily: "inherit",
                }}
                disabled={disabled}
                className="out-line"
                onClick={() => setSelectedVoucher(voucher)}
              >
                Dùng ngay <RightOutlined />
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
