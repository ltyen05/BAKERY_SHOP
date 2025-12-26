import React, { useState, useRef, useEffect } from "react";
import {
  Row,
  Col,
  Button,
  Tag,
  Steps,
  Typography,
  Avatar,
  Form,
  Input,
  message,
  Skeleton,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  CarOutlined,
  FileDoneOutlined,
  InboxOutlined,
  CheckCircleOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import Voucher from "../../../components/Voucher/Voucher";
import OrderDetails from "../../../components/Order/OrderDetails";
import { useAuth } from "../../../context/AuthContext";
import { useAccount } from "../../../context/AccountContext";
import { useOrder } from "../../../context/OrderContext";
const { Title, Text } = Typography;
const rankColors = {
  diamond: "#b9f2ff", // màu xanh sáng cho diamond
  gold: "gold",
  silver: "silver",
  bronze: "#cd7f32", // màu đồng
};
const style = {
  container: {
    backgroundColor: "#FFFBF7",
    padding: "30px 0 100px",
    width: "82%",
    margin: "auto",
  },
  card: {
    backgroundColor: "transparent",
    borderRadius: 15,
    padding: "20px",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    border: "1px solid #d9d9d9",
    padding: "4px 12px",
    color: "#555",
  },
  stepIcon: {
    color: "#D93F3C",
    fontSize: 24,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: "50%",
    border: "1px solid #f0f0f0",
  },
  actionBtn: { color: "#fff", border: "none", borderRadius: 20 },
};

const UserProfile = () => {
  const { user, setUser } = useAuth(); // nhớ context phải có setUserInfo nếu muốn update
  const { update_profile, get_rank } = useAccount();
  const { coupons, refetchCoupons, setSelectedVoucher } = useOrder();
  const [loading, setLoading] = useState(true);
  const [rankData, setRankData] = useState(null);
  const [voucherList, setVoucherList] = useState([]);
  const [isShowingVoucher, setIsShowingVoucher] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(
    "https://i.pinimg.com/originals/24/bd/d9/24bdd9ec59a9f8966722063fe7791183.jpg"
  );

  const fileInputRef = useRef(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchRank = async () => {
      try {
        const data = await get_rank(); // gọi API
        setRankData(data);
      } catch (err) {
        console.error("Rank fetch error:", err);
      }
    };

    fetchRank();
  }, [get_rank]);
  /* ========================== Đồng bộ userInfo vào Form ========================== */
  useEffect(() => {
    if (!user) return;

    form.setFieldsValue({
      email: user.email,
      phone: user.phone,
    });

    setCurrentAvatarUrl(currentAvatarUrl);
    setLoading(false);
  }, [user, form]);

  /* ========================== AVATAR PREVIEW ========================== */
  const handleSelectAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => setCurrentAvatarUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

  /* ========================== SAVE PROFILE ========================== */
  const handleSave = async (values) => {
    try {
      const data = await update_profile(values.email, values.phone); // đã trả data
      setUser((prev) => ({ ...prev, ...data }));
      message.success("Cập nhật thành công!");
      setIsEditing(false);
    } catch (err) {
      message.error(err.message || "Cập nhật thất bại");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setCurrentAvatarUrl(currentAvatarUrl);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div style={{ padding: 50 }}>
        <Skeleton avatar paragraph={{ rows: 4 }} active />
      </div>
    );
  }

  /* ========================== UI ========================== */
  return (
    <Row style={style.container}>
      {/* LEFT CARD */}
      <Col xs={24} lg={10} xl={8}>
        <div style={style.card}>
          <div
            style={{
              padding: 20,
              borderRadius: 18,
              backgroundColor: "rgb(247, 242, 235)",
            }}
          >
            <Row align="middle" justify="center" style={{ marginBottom: 30 }}>
              <Col className="fl-center" style={{ flexDirection: "column" }}>
                <Avatar
                  size={100}
                  src={currentAvatarUrl}
                  icon={<UserOutlined />}
                  onClick={() => isEditing && fileInputRef.current.click()}
                  style={{ cursor: isEditing ? "pointer" : "default" }}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  hidden
                  onChange={handleSelectAvatar}
                />

                <Title level={4}>{user?.full_name}</Title>
                <Tag color={rankData ? rankColors[rankData.rank] : "default"}>
                  {rankData?.rank?.toUpperCase() || "..."}
                </Tag>
              </Col>

              <div style={{ position: "absolute", top: 30, right: 30 }}>
                {isEditing ? (
                  <>
                    <Button
                      icon={<CloseOutlined />}
                      onClick={handleCancel}
                      style={{ ...style.actionBtn, background: "#d9533c" }}
                    />
                    <Button
                      icon={<SaveOutlined />}
                      onClick={() => form.submit()}
                      style={{ ...style.actionBtn, background: "#c5762b" }}
                    />
                  </>
                ) : (
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => setIsEditing(true)}
                    style={{ ...style.actionBtn, background: "#F4B400" }}
                  />
                )}
              </div>
            </Row>
            <Form
              form={form}
              layout="vertical"
              disabled={!isEditing}
              onFinish={handleSave}
            >
              <Form.Item name="email" label="Email">
                <Input style={style.input} />
              </Form.Item>

              <Form.Item name="phone" label="Số điện thoại">
                <Input style={style.input} />
              </Form.Item>
            </Form>
            <Text strong>Tổng tiền:</Text>{" "}
            <Text>
              {(rankData?.total_amount_spent ?? 0).toLocaleString("vi-VN")} đ
            </Text>
          </div>
        </div>

        <Row justify="center" gutter={20} style={{ marginTop: 20 }}>
          <Col>
            <Button
              className="btn btn-primary"
              onClick={() => setIsShowingVoucher(true)}
            >
              Mã Giảm Giá
            </Button>
          </Col>
          <Col>
            <Button className="btn btn-primary">Lịch sử mua hàng</Button>
          </Col>
        </Row>
      </Col>

      {/* RIGHT CARD */}
      <Col xs={24} md={24} lg={14} xl={16} className="fl-center mt-3 mb-3">
        <div style={{ ...style.card, marginTop: "-30px", width: "100%" }}>
          <Title level={3} style={{ marginBottom: 40, color: "#4A4A6A" }}>
            Đơn hàng hiện tại của bạn
          </Title>

          <Steps
            current={2}
            labelPlacement="vertical"
            items={[
              {
                title: "Shipper đang lấy hàng",
                icon: <InboxOutlined style={style.stepIcon} />,
              },
              {
                title: "Đã lấy hàng",
                icon: <FileDoneOutlined style={style.stepIcon} />,
              },
              {
                title: "Đang giao",
                icon: (
                  <CarOutlined style={{ ...style.stepIcon, fontSize: 35 }} />
                ),
              },
              {
                title: "Giao hàng thành công",
                icon: <CheckCircleOutlined style={style.stepIcon} />,
              },
            ]}
          />

          <Row justify="end" style={{ marginTop: 20 }}>
            <Button
              className="btn btn-primary"
              onClick={() => setShowOrderDetails(true)}
            >
              Xem chi tiết đơn hàng
            </Button>
          </Row>
        </div>
      </Col>

      {/* VOUCHER MODAL */}
      {isShowingVoucher && (
        <div className="fl-center showUp">
          <div
            style={{
              width: "95%",
              maxWidth: "420px",
              backgroundColor: "#fdfbf5",
              height: "90%",
              borderRadius: "8px",
              flexDirection: "column",
              position: "relative",
            }}
            className="fl-center"
          >
            <div
              className="scrollbar"
              style={{
                width: "100%",
                maxHeight: "100%",
                overflowY: "auto",
                padding: "20px",
              }}
            >
              <p style={{ fontSize: 20, fontWeight: 500 }}>Mã Giảm Giá</p>
              <button
                onClick={() => setIsShowingVoucher(false)}
                style={{
                  position: "absolute",
                  top: 15,
                  right: 15,
                  fontSize: 15,
                }}
                className="out-line"
              >
                <CloseOutlined />
              </button>

              {coupons.map((voucher) => (
                <div
                  key={voucher?.coupon_id}
                  className="mt-3"
                  style={{
                    borderRadius: 12,
                    border: "1px solid",
                    overflow: "hidden",
                    width: "100%",
                  }}
                >
                  <Voucher
                    voucher={voucher}
                    setSelectedVoucher={setSelectedVoucher}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {showOrderDetails && (
        <div className="fl-center showUp">
          <div
            style={{
              width: "95%",
              maxWidth: "550px",
              backgroundColor: "#fdfbf5",
              height: "90%",
              borderRadius: "8px",
              flexDirection: "column",
              position: "relative",
            }}
            className="fl-center"
          >
            <OrderDetails />
            <button
              onClick={() => setShowOrderDetails(false)}
              style={{ position: "absolute", top: 15, right: 15, fontSize: 15 }}
              className="out-line"
            >
              <CloseOutlined />
            </button>
          </div>
        </div>
      )}
    </Row>
  );
};

export default UserProfile;
