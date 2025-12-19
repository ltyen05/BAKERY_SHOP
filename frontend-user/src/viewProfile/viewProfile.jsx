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

/* ================= CONFIG ================= */
const API_BASE = "http://localhost:5001";
/* ========================================= */

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

  const [loading, setLoading] = useState(true);
  const [voucherList, setVoucherList] = useState([]);
  const [isShowingVoucher, setIsShowingVoucher] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [userInfo, setUserInfo] = useState(initialUserInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(
    initialUserInfo.avatarUrl
  );

  const fileInputRef = useRef(null);
  const [form] = Form.useForm();

  /* ================= FETCH VOUCHER ================= */
  useEffect(() => {
    if (!user?.id) return;

    fetch(`${API_BASE}/coupon/${user.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Fetch voucher failed");
        return res.json();
      })
      .then((data) => {
        setVoucherList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Voucher error:", err);
        setLoading(false);
      });
  }, [user?.id]);

  /* ================= AVATAR PREVIEW ================= */
  const handleSelectAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => setCurrentAvatarUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

  /* ================= SAVE PROFILE ================= */
  const handleSave = async (values) => {
    try {
      const token = localStorage.getItem("token");

      const updateData = {
        full_name: values.full_name || userInfo.name,
        phone: values.phone,
        address: values.address,
      };

      /* ---- UPDATE PROFILE ---- */
      const profileRes = await fetch(
        `${API_BASE}/api/account/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!profileRes.ok) throw new Error("Update profile failed");

      /* ---- UPDATE AVATAR ---- */
      const file = fileInputRef.current?.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("avatar", file);

        const avatarRes = await fetch(
          `${API_BASE}/api/account/avatar`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!avatarRes.ok) throw new Error("Upload avatar failed");
      }

      setUserInfo((prev) => ({
        ...prev,
        ...values,
        name: values.full_name,
      }));

      setIsEditing(false);
      alert("Cập nhật thành công!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Cập nhật thất bại");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setCurrentAvatarUrl(userInfo.avatarUrl);
    setIsEditing(false);
  };

  /* ================= UI ================= */
  return (
    <Row style={style.container}>
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

                <Title level={4}>{userInfo.name}</Title>
                <Tag color="gold">{userInfo.rank}</Tag>
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
              initialValues={userInfo}
              onFinish={handleSave}
            >
              <Form.Item name="email" label="Email">
                <Input style={style.input} />
              </Form.Item>

              <Form.Item name="phone" label="Số điện thoại">
                <Input style={style.input} />
              </Form.Item>
            </Form>

            <Text strong>Tổng tiền:</Text> <Text>{userInfo.totalSpent} VNĐ</Text>
          </div>
        </div>
      </Col>

      {/* Các phần còn lại giữ nguyên */}
    </Row>
  );
};

export default UserProfile;
