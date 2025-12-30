import OrderHistory from "../../../components/HistoryOrder/HistoryOrder";
import { HomeFilled, PhoneFilled } from "@ant-design/icons";
import starIcon from "../../../assets/Star.svg";
import { Row, Col } from "antd";
import phone from "../../../assets/phone.svg";
export default function Facilities() {
  const branches = [
    {
      branch_id: 1,
      name: "HUS Bakery - Hoàn Kiếm",
      address: "15 Hàng Bạc, Hoàn Kiếm, Hà Nội",
      map_src:
        "https://www.google.com/maps?q=15+Hàng+Bạc,+Hoàn+Kiếm,+Hà+Nội&output=embed",
      phone: "0241234567",
      email: "hoankiem@husbakery.vn",
    },
    {
      branch_id: 2,
      name: "HUS Bakery - Cầu Giấy",
      address: "89 Trần Duy Hưng, Cầu Giấy, Hà Nội",
      map_src:
        "https://www.google.com/maps?q=89+Trần+Duy+Hưng,+Cầu+Giấy,+Hà+Nội&output=embed",
      phone: "0242345678",
      email: "caugiay@husbakery.vn",
    },
    {
      branch_id: 3,
      name: "HUS Bakery - Đống Đa",
      address: "120 Tây Sơn, Đống Đa, Hà Nội",
      map_src:
        "https://www.google.com/maps?q=120+Tây+Sơn,+Đống+Đa,+Hà+Nội&output=embed",
      phone: "0243456789",
      email: "dongda@husbakery.vn",
    },
    {
      branch_id: 4,
      name: "HUS Bakery - Hà Đông",
      address: "65 Quang Trung, Hà Đông, Hà Nội",
      map_src:
        "https://www.google.com/maps?q=65+Quang+Trung,+Hà+Đông,+Hà+Nội&output=embed",
      phone: "0244567890",
      email: "hadong@husbakery.vn",
    },
    {
      branch_id: 5,
      name: "HUS Bakery - Long Biên",
      address: "20 Nguyễn Văn Cừ, Long Biên, Hà Nội",
      map_src:
        "https://www.google.com/maps?q=20+Nguyễn+Văn+Cừ,+Long+Biên,+Hà+Nội&output=embed",
      phone: "0245678901",
      email: "longbien@husbakery.vn",
    },
  ];

  return (
    <div>
      {branches.map((branch) => (
        <div className="fl-center" style={{ textAlign: "start" }}>
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
                title="map-334-nguyen-trai"
                src={branch.map_src}
                style={{
                  border: 0,
                  width: "100%",
                  height: "450px",
                  borderRadius: "12px",
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </Col>
          </Row>
        </div>
      ))}

      <OrderHistory />
    </div>
  );
}
