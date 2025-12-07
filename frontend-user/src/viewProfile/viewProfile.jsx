import React, { useState, useRef } from "react";
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
import Voucher from "../components/Voucher/Voucher";
import OrderDetails from "../components/Order/OrderDetails";
const { Title, Text } = Typography;

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

const UserProfile = ({ user }) => {
  const initialUserInfo = {
    name: user?.name,
    rank: "Rank Gold",
    email: "husbakery@hus.edu.vn",
    phone: "0123456789",
    totalSpent: "10,000,000",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
  };
  const voucherList = [
    { discount: 20, minOrder: 100000, expiryDate: "31/12/2024" },
    { discount: 15, minOrder: 50000, expiryDate: "30/11/2024" },
    { discount: 10, minOrder: 20000, expiryDate: "31/10/2024" },
  ];
  const [isShowingVoucher, setIsShowingVoucher] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [userInfo, setUserInfo] = useState(initialUserInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(
    initialUserInfo.avatarUrl
  );
  // tạo ra một đối tượng ref để giữ tham chiếu đến phần tử <input type="file">.
  const fileInputRef = useRef(null);
  const [form] = Form.useForm();

  const handleSelectAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setCurrentAvatarUrl(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (values) => {
    setUserInfo({
      ...values,
      name: user?.username,
      rank: "Rank Gold",
      avatarUrl: currentAvatarUrl,
      totalSpent: userInfo.totalSpent,
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setCurrentAvatarUrl(userInfo.avatarUrl);
    setIsEditing(false);
  };

  return (
    <Row style={{ ...style.container }}>
      {/* <Title level={2} style={{ color: "#4A4A6A", marginBottom: 30 }}>
        Chào mừng bạn !!
      </Title> */}

      {/* —— CARD THÔNG TIN —— rgb(246, 246, 246) */}
      <Col xs={24} md={24} lg={10} xl={8}>
        <div style={{ ...style.card, position: "relative" }}>
          <div
            style={{
              padding: "20px",
              borderRadius: "18px",
              backgroundColor: " rgb(247, 242, 235)",
            }}
          >
            <Row align="middle" justify="center" style={{ marginBottom: 30 }}>
              <Col
                style={{
                  gap: 8,
                  flexDirection: "column",
                }}
                className="fl-center"
              >
                {/* —— AVATAR —— */}
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  <Avatar
                    size={100}
                    src={currentAvatarUrl}
                    icon={<UserOutlined />}
                    onClick={() => isEditing && fileInputRef.current.click()}
                    style={{ cursor: isEditing ? "pointer" : "default" }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleSelectAvatar}
                  />
                </div>

                <div>
                  <Title level={4} style={{ margin: 0 }}>
                    {userInfo.name}
                  </Title>
                  <Tag
                    color="gold"
                    style={{
                      marginTop: 5,
                      borderRadius: 10,
                      margin: "5px 0 0 ",
                    }}
                  >
                    {userInfo.rank}
                  </Tag>
                </div>
              </Col>

              <div
                style={{
                  position: "absolute",
                  top: 30,
                  right: 30,
                }}
              >
                {isEditing ? (
                  <Row gutter={10}>
                    <Col>
                      <Button
                        icon={<CloseOutlined />}
                        onClick={handleCancel}
                        style={{
                          ...style.actionBtn,
                          backgroundColor: "#d9533cff",
                        }}
                      ></Button>
                    </Col>
                    <Col>
                      <Button
                        icon={<SaveOutlined />}
                        onClick={() => form.submit()}
                        style={{
                          ...style.actionBtn,
                          backgroundColor: "#c5762b",
                        }}
                      ></Button>
                    </Col>
                  </Row>
                ) : (
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => setIsEditing(true)}
                    style={{ ...style.actionBtn, backgroundColor: "#F4B400" }}
                  ></Button>
                )}
              </div>
            </Row>

            <Form
              form={form}
              // labelCol={{ span: 8 }}
              // wrapperCol={{ span: 16 }}
              layout="vertical"
              disabled={!isEditing}
              initialValues={userInfo}
              onFinish={handleSave}
            >
              <Form.Item name="email" label="Email">
                <Input style={style.input} readOnly={!isEditing} />
              </Form.Item>

              <Form.Item name="phone" label="Số điện thoại">
                <Input style={style.input} readOnly={!isEditing} />
              </Form.Item>
            </Form>

            <div style={{ marginTop: 15 }}>
              <Text strong>Tổng tiền mua hàng:</Text>{" "}
              <Text>{userInfo.totalSpent} VNĐ</Text>
            </div>
          </div>
        </div>
        <Row justify="center" gutter={20}>
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

      <Col xs={24} md={24} lg={14} xl={16} className="fl-center">
        <div
          style={{
            ...style.card,
            marginTop: "-30px",
            width: "100%",
          }}
        >
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
          <Row justify="end">
            <Button
              className="mt-6 btn btn-primary"
              onClick={() => setShowOrderDetails(true)}
            >
              Xem chi tiết đơn hàng
            </Button>
          </Row>
        </div>

        {/* —— FOOTER —— */}
      </Col>

      {/* ---------------------------------------------------------------------------------------- */}
      {isShowingVoucher && (
        <div className="fl-center showUp">
          <div
            style={{
              width: "95%",
              maxWidth: "450px",
              backgroundColor: " #fdfbf5",
              padding: "20px",
              paddingBottom: "40px",
              borderRadius: "8px",
              flexDirection: "column",
              position: "relative",
            }}
            className="fl-center"
          >
            <p>Mã Giảm Giá</p>
            <button
              onClick={() => setIsShowingVoucher(false)}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",

                fontSize: "15px",
              }}
              className="out-line"
            >
              <CloseOutlined />
            </button>

            {voucherList.map((voucher) => (
              <div
                className="mt-3"
                style={{
                  borderRadius: "12px",
                  border: "1px solid",
                  overflow: "hidden",
                }}
              >
                <Voucher
                  discount={voucher.discount}
                  minOrder={voucher.minOrder}
                  expiryDate={voucher.expiryDate}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------------------------------ */}
      {showOrderDetails && (
        <div className="fl-center showUp ">
          <div
            style={{
              width: "95%",
              maxWidth: "550px",
              backgroundColor: " #fdfbf5",
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
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                fontSize: "15px",
              }}
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
