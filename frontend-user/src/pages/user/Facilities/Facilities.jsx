import { HomeFilled, PhoneFilled } from "@ant-design/icons";
import starIcon from "../../../assets/Star.svg";
import { Row, Col } from "antd";
import phone from "../../../assets/phone.svg";
import { useAccount } from "../../../context/AccountContext";
// ... các phần import giữ nguyên

export default function Facilities() {
  const { branches } = useAccount();

  // 1. Kiểm tra nếu chưa có dữ liệu (đang load)
  if (!branches) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" tip="Đang tải danh sách chi nhánh..." />
      </div>
    );
  }

  // 2. LẤY MẢNG TỪ TRONG DETAILS RA
  // Dựa vào log của bạn, dữ liệu nằm trong branches.details
  const branchList = branches.details || [];

  // 3. Nếu mảng rỗng
  if (branchList.length === 0) {
    return (
      <div style={{ padding: "50px" }}>
        <Empty description="Hiện chưa có thông tin chi nhánh" />
      </div>
    );
  }

  return (
    <div>
      {/* 4. SỬ DỤNG branchList ĐỂ MAP */}
      {branchList.map((branch, index) => (
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
                src={branch.map_link} // Lưu ý: Kiểm tra lại tên field này trong log (có thể là mapSrc hoặc map_link)
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