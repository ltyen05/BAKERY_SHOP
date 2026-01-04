import { Row, Col, Button } from "antd";
import logo from "../../assets/logo-noText.svg";
import { RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
export default function Voucher({
  voucher,
  setSelectedVoucher,
  disabled = false,
}) {
  const navigate = useNavigate();
  const handleClick = () => {
    // Lưu voucher được chọn
    setSelectedVoucher(voucher);

    // Điều hướng sang trang Menu
    navigate("/menu/bread");
  };
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
                onClick={handleClick}
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
