import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Card,
  message,
  Radio,
  Space,
  List,
  Select,
  Row,
} from "antd";
import {
  EnvironmentOutlined,
  ShopOutlined,
  PhoneOutlined,
  UserOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import ProductItem from "../../../components/Product/ProductItem";
import { useOrder } from "../../../context/OrderContext";
import { useAccount } from "../../../context/AccountContext";

const { TextArea } = Input;
const { Option } = Select;

const BASE_TIME = 30;
const PER_KM_TIME = 5;

export default function ShippingAddressForm() {
  const { branches } = useAccount();
  const { coupons, create_order, loadingCreateOrder, selectedVoucher, setSelectedVoucher, productInCart } =
    useOrder();

  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();
  const navigate = useNavigate();

  const { totalPrice = 0 } = location.state || {};

  const [receiverName, setReceiverName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  const [verificationResult, setVerificationResult] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(false);

  // ===== SAFE DATA =====
  const stores = Array.isArray(branches) ? branches : branches?.details || [];

  // ===== DISTANCE =====
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
      const store = stores.find((s) => s.branch_id === selectedStore);
      if (store) {
        setDistance(
          calculateDistance(
            +verificationResult.lat,
            +verificationResult.lon,
            +store.lat,
            +(store.lng || store.lon)
          )
        );
      }
    } else {
      setDistance(null);
    }
  }, [verificationResult, selectedStore, stores]);

  // ===== SHIPPING =====
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

  const estimatedDelivery =
    distance &&
    BASE_TIME + Math.ceil(distance) * PER_KM_TIME;

  // ===== VERIFY ADDRESS =====
  const verifyAddress = async () => {
    if (!address.trim()) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          address + ", Vietnam"
        )}&format=json&limit=1`
      );
      const data = await res.json();
      if (data.length) {
        setVerificationResult({
          valid: true,
          lat: data[0].lat,
          lon: data[0].lon,
        });
      }
    } catch {}
  };

  // ===== SUBMIT =====
  const handleSubmit = async () => {
    if (!receiverName || !phoneNumber || !address) {
      messageApi.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    if (!verificationResult || !selectedStore) {
      messageApi.warning("Vui lòng xác thực địa chỉ và chọn cửa hàng!");
      return;
    }

    setLoading(true);
    try {
      await create_order({
        recipient_name: receiverName,
        phone: phoneNumber,
        total_amount: finalPrice,
        branch_id: selectedStore,
        shipping_address: address,
        payment_method: paymentMethod,
        note,
        coupon_id: selectedVoucher?.coupon_id || null,
      });
      messageApi.success("Đặt hàng thành công!");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  // ===== UI (GIỮ NGUYÊN) =====
  return (
    <>
      {contextHolder}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
        <h1 style={{ textAlign: "center" }}>Thông Tin Đặt Hàng</h1>

        <Row>
          <label><UserOutlined /> Tên người nhận</label>
          <Input value={receiverName} onChange={(e) => setReceiverName(e.target.value)} />
        </Row>

        <Row>
          <label><PhoneOutlined /> Số điện thoại</label>
          <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </Row>

        <Row>
          <label><EnvironmentOutlined /> Địa chỉ</label>
          <TextArea
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setVerificationResult(null);
            }}
            onBlur={verifyAddress}
          />
        </Row>

        <Row>
          <label><ShopOutlined /> Chọn cửa hàng</label>
          <Select value={selectedStore} onChange={setSelectedStore}>
            {stores.map((s) => (
              <Option key={s.branch_id} value={s.branch_id}>{s.name}</Option>
            ))}
          </Select>
        </Row>

        {productInCart.map((p) => (
          <ProductItem key={p.product_id} product={p} />
        ))}

        <Select
          value={selectedVoucher?.coupon_id}
          onChange={(id) =>
            setSelectedVoucher(coupons.find((v) => v.coupon_id === id) || null)
          }
          allowClear
        >
          {coupons.map((v) => (
            <Option key={v.coupon_id} value={v.coupon_id}>{v.description}</Option>
          ))}
        </Select>

        <h2>Tổng: {finalPrice.toLocaleString()}đ</h2>
        {estimatedDelivery && <p>Giao hàng ~ {estimatedDelivery} phút</p>}

        <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <Space>
            <Radio value="COD">COD</Radio>
            <Radio value="QR">QR</Radio>
          </Space>
        </Radio.Group>

        <Button
          type="primary"
          block
          loading={loading || loadingCreateOrder}
          onClick={handleSubmit}
        >
          Đặt hàng
        </Button>
      </div>
    </>
  );
}
