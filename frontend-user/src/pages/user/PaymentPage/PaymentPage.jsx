import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Card,
  message,
  Spin,
  Radio,
  Space,
  List,
  Select,
  Row,
} from "antd";
import {
  EnvironmentOutlined,
  CheckCircleOutlined,
  ShopOutlined,
  PhoneOutlined,
  UserOutlined,
  TagOutlined,
} from "@ant-design/icons";
import logo from "../../../assets/logo-noText.svg";
import { useLocation, useNavigate } from "react-router-dom";
import ProductItem from "../../../components/Product/ProductItem";
import Voucher from "../../../components/Voucher/Voucher";
import cod from "../../../assets/COD.svg";
import qrCodeImg from "../../../assets/QR.svg";
import { useOrder } from "../../../context/OrderContext";
import { useAccount } from "../../../context/AccountContext";

const { TextArea } = Input;
const { Option } = Select;

const BASE_TIME = 30;
const PER_KM_TIME = 5;

export default function ShippingAddressForm() {
  const { branches } = useAccount();
  const stores = Array.isArray(branches) ? branches : []; // ⭐ FIX CHÍNH

  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();
  const navigate = useNavigate();

  const { totalPrice = 0 } = location.state || {};
  const {
    coupons,
    create_order,
    loadingCreateOrder,
    selectedVoucher,
    setSelectedVoucher,
    productInCart,
  } = useOrder();

  const [receiverName, setReceiverName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const [selectedStore, setSelectedStore] = useState(null);
  const [distance, setDistance] = useState(null);

  // ====== DISTANCE ======
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  useEffect(() => {
    if (verificationResult?.valid && selectedStore) {
      const store = stores.find(
        (s) => s.branch_id === selectedStore
      );
      if (store) {
        setDistance(
          calculateDistance(
            Number(verificationResult.lat),
            Number(verificationResult.lon),
            store.lat,
            store.lng
          )
        );
      }
    } else {
      setDistance(null);
    }
  }, [verificationResult, selectedStore, stores]);

  // ====== SHIPPING ======
  const getShippingFee = (d) => {
    if (!d) return 0;
    if (d < 2) return 10000;
    if (d < 4) return 16000;
    if (d < 8) return 25000;
    return 35000;
  };

  const shippingFee = getShippingFee(distance);

  const discount = selectedVoucher
    ? selectedVoucher.discount_type === "percent"
      ? Math.min(
          totalPrice * (selectedVoucher.discount_percent / 100),
          selectedVoucher.max_discount
        )
      : selectedVoucher.discount_value
    : 0;

  const finalPrice = Math.max(totalPrice - discount + shippingFee, 0);

  // ====== SUBMIT ======
  const handleSubmit = async () => {
    if (!receiverName || !phoneNumber || !verificationResult?.valid || !selectedStore) {
      messageApi.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    try {
      await create_order({
        recipient_name: receiverName,
        phone: phoneNumber,
        branch_id: selectedStore,
        shipping_address: address,
        total_amount: finalPrice,
        payment_method: paymentMethod,
        note,
        coupon_id: selectedVoucher?.coupon_id || null,
      });
      messageApi.success("Đặt hàng thành công!");
      navigate("/");
    } catch (e) {
      messageApi.error("Đặt hàng thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div style={{ maxWidth: 800, margin: "auto", padding: 24 }}>
        <h1 style={{ textAlign: "center" }}>Thông Tin Đặt Hàng</h1>

        {/* CHỌN CỬA HÀNG */}
        <label><ShopOutlined /> Cửa hàng</label>
        <Select
          size="large"
          value={selectedStore}
          onChange={setSelectedStore}
          placeholder="Chọn cửa hàng"
          style={{ width: "100%", marginBottom: 24 }}
        >
          {stores.map((store) => (
            <Option
              key={store.branch_id}
              value={store.branch_id}
            >
              <img src={logo} width={24} /> {store.name}
            </Option>
          ))}
        </Select>

        {/* SẢN PHẨM */}
        {productInCart.map((p) => (
          <ProductItem key={p.product_id} product={p} />
        ))}

        <div style={{ textAlign: "right", marginTop: 24 }}>
          <Button
            type="primary"
            loading={loading || loadingCreateOrder}
            onClick={handleSubmit}
            icon={<CheckCircleOutlined />}
          >
            Đặt hàng
          </Button>
        </div>
      </div>
    </>
  );
}
