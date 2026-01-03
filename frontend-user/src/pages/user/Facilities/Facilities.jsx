import { HomeFilled, PhoneFilled } from "@ant-design/icons";
import starIcon from "../../../assets/Star.svg";
import { Row, Col, Empty, Spin } from "antd"; // Thêm Empty và Spin để thông báo khi không có dữ liệu
import phone from "../../../assets/phone.svg";
import { useAccount } from "../../../context/AccountContext";

export default function Facilities() {
  const { branches } = useAccount();

  // 1. Hiển thị Loading khi đang chờ dữ liệu
  if (!branches) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" tip="Đang tải danh sách chi nhánh..." />
      </div>
    );
  }

  // 2. Hiển thị thông báo rỗng nếu mảng trả về không có phần tử nào
  if (Array.isArray(branches) && branches.length === 0) {
    return (
      <div style={{ padding: "50px" }}>
        <Empty description="Hiện chưa có thông tin chi nhánh" />
      </div>
    );
  }

  return (
    <div>
      {/* 3. Sử dụng Optional Chaining ?. để map an toàn */}
      {branches?.map((branch, index) => (
        <div key={branch.branch_id || index} className="fl-center" style={{ textAlign: "start" }}>
          <Row
            className="mt-12 mb-12"
            style={{ width: "95%", maxWidth: "1200px" }}
            gutter={30}
          >
            <Col xs={24} md={24} xl={12}>
              <div
                className="fl mb-3"
                style={{
                  gap: "20px",
                  alignItems: "end",
                }}
              >
                <h1
                  style={{
                    lineHeight: "35px",
                    fontSize: "35px",
                  }}
                >
                  {branch.name}
                </h1>
                <div className="rating">
                  <span>4.5</span>
                  <img src={starIcon} alt="star" />
                </div>
              </div>
              <div className="mb-2 fl" style={{ gap: "10px" }}>
                <HomeFilled style={{ fontSize: "20px" }} />
                {branch.address}
              </div>
              <div className="fl mb-3" style={{ gap: "10px" }}>
                <img src={phone} alt="phone" />
                {branch.phone}
              </div>
            </Col>
            <Col xs={24} md={24} xl={12}>
              <iframe
                title={`map_${branch.branch_id || index}`}
                src={branch.mapSrc}
                style={{
                  border: 0,
                  height: "450px",
                  borderRadius: "12px",
                }}
                className="w100"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </Col>
          </Row>
        </div>
      ))}
    </div>
  );
}