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
const BASE_TIME = 30; // phút
const PER_KM_TIME = 5;

export default function ShippingAddressForm() {
  const { branches } = useAccount();
  const [messageApi, contextHolder] = message.useMessage();
  const [note, setNote] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { totalPrice = 0 } = location.state || {};
  const { coupons, create_order, loadingCreateOrder } = useOrder();
  const [receiverName, setReceiverName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [searchingHints, setSearchingHints] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [distance, setDistance] = useState(null);
  const { selectedVoucher, setSelectedVoucher, productInCart } = useOrder();

  // Tính toán thời gian giao hàng
  const getEstimatedDeliveryTime = (dist) => {
    if (!dist) return null;
    const roundedKm = Math.ceil(dist);
    const totalMinutes = BASE_TIME + roundedKm * PER_KM_TIME;
    return { roundedKm, totalMinutes };
  };

  const estimatedDelivery = getEstimatedDeliveryTime(distance);

  // Kiểm tra voucher
  useEffect(() => {
    if (!selectedVoucher) return;
    if (totalPrice < selectedVoucher.min_purchase) {
      setSelectedVoucher(null);
      messageApi.warning(
        `Voucher yêu cầu đơn hàng tối thiểu ${selectedVoucher.min_purchase.toLocaleString()}đ. Voucher đã bị hủy.`
      );
    }
  }, [totalPrice, selectedVoucher, setSelectedVoucher, messageApi]);

  const getShippingFee = (dist) => {
    if (!dist) return 0;
    if (dist < 2) return 10000;
    if (dist < 4) return 16000;
    if (dist < 8) return 25000;
    return 35000;
  };

  const shippingFee = getShippingFee(distance);

  const discount = selectedVoucher
    ? selectedVoucher.discount_type === "percent"
      ? Math.min(
          Number(totalPrice) * (Number(selectedVoucher.discount_percent) / 100),
          Number(selectedVoucher.max_discount)
        )
      : Number(selectedVoucher.discount_value)
    : 0;

  const finalPrice = Math.max(totalPrice - discount + shippingFee, 0);

  // Chuyển branches thành mảng stores an toàn
  const stores = Array.isArray(branches) ? branches : branches?.details || [];

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Tính khoảng cách
  useEffect(() => {
    if (verificationResult?.valid && selectedStore) {
      const store = stores.find((s) => s.branch_id === selectedStore);
      if (store) {
        const d = calculateDistance(
          parseFloat(verificationResult.lat),
          parseFloat(verificationResult.lon),
          parseFloat(store.lat),
          parseFloat(store.lng || store.lon)
        );
        setDistance(d);
      }
    } else {
      setDistance(null);
    }
  }, [verificationResult, selectedStore, stores]);

  const searchAddressSuggestions = async (query) => {
    if (query.trim().length < 3) return;
    setSearchingHints(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query + ", Vietnam"
        )}&format=json&addressdetails=1&limit=5`,
        { headers: { "User-Agent": "ShippingAddressVerification/1.0" } }
      );
      const data = await response.json();
      setSuggestions(data.map((item) => ({
        displayName: item.display_name,
        lat: item.lat,
        lon: item.lon,
        address: item.address,
      })));
    } catch (err) {
      console.error(err);
    } finally {
      setSearchingHints(false);
    }
  };

  const selectSuggestion = (suggestion) => {
    setAddress(suggestion.displayName);
    setVerificationResult({
      valid: true,
      displayName: suggestion.displayName,
      lat: suggestion.lat,
      lon: suggestion.lon,
      address: suggestion.address,
    });
    setSuggestions([]);
    messageApi.success("Đã chọn địa chỉ!");
  };

  const verifyAddress = async () => {
    if (!address.trim()) {
      messageApi.error("Vui lòng nhập địa chỉ!");
      return;
    }
    setVerifying(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          address + ", Vietnam"
        )}&format=json&addressdetails=1&limit=1`,
        { headers: { "User-Agent": "ShippingAddressVerification/1.0" } }
      );
      const data = await response.json();
      if (data.length > 0) {
        const result = data[0];
        setVerificationResult({
          valid: true,
          displayName: result.display_name,
          lat: result.lat,
          lon: result.lon,
          address: result.address,
        });
        messageApi.success("Địa chỉ hợp lệ!");
      } else {
        messageApi.warning("Không tìm thấy địa chỉ này!");
      }
    } catch (err) {
      messageApi.error("Lỗi xác thực địa chỉ!");
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async () => {
    if (!receiverName.trim() || !phoneNumber.trim() || !address.trim()) {
      messageApi.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    if (!verificationResult?.valid || !selectedStore) {
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
        payment_method: paymentMethod.toUpperCase(),
        note: note || null,
        coupon_id: selectedVoucher?.coupon_id || null,
      });
      messageApi.success("Đặt hàng thành công!");
      navigate("/");
    } catch (err) {
      messageApi.error(err.message || "Đặt hàng thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleVoucherChange = (voucherId) => {
    const voucher = coupons.find((v) => v.coupon_id === voucherId);
    if (!voucher) {
        setSelectedVoucher(null);
        return;
    }
    if (totalPrice < voucher.min_purchase) {
      messageApi.warning(`Đơn hàng tối thiểu ${voucher.min_purchase.toLocaleString()}đ`);
      return;
    }
    setSelectedVoucher(voucher);
  };

  return (
    <>
      {contextHolder}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "24px" }}>Thông Tin Đặt Hàng</h1>

        {/* Tên người nhận */}
        <Row style={{ marginBottom: "16px" }}>
          <div style={{ width: "100%" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
              <UserOutlined /> Tên người nhận
            </label>
            <Input
              size="large"
              placeholder="Nhập tên người nhận"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
            />
          </div>
        </Row>

        {/* Số điện thoại */}
        <Row style={{ marginBottom: "16px" }}>
          <div style={{ width: "100%" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
              <PhoneOutlined /> Số điện thoại
            </label>
            <Input
              size="large"
              placeholder="Nhập số điện thoại"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              maxLength={11}
            />
          </div>
        </Row>

        {/* Địa chỉ */}
        <Row style={{ marginBottom: "16px", position: "relative" }}>
          <div style={{ width: "100%" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
              <EnvironmentOutlined /> Địa chỉ nhận hàng
            </label>
            <TextArea
              rows={3}
              placeholder="Nhập địa chỉ chi tiết"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setVerificationResult(null);
              }}
              onBlur={() => {
                if (address.trim() && !verificationResult) verifyAddress();
              }}
            />
            {suggestions.length > 0 && (
              <Card size="small" style={{ position: "absolute", zIndex: 10, width: "100%" }}>
                <List
                  dataSource={suggestions}
                  renderItem={(item) => (
                    <List.Item onClick={() => selectSuggestion(item)} style={{ cursor: "pointer" }}>
                      {item.displayName}
                    </List.Item>
                  )}
                />
              </Card>
            )}
          </div>
        </Row>

        {/* Chọn cửa hàng */}
        <Row style={{ marginBottom: "48px" }}>
          <div style={{ width: "100%" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
              <ShopOutlined /> Chọn cửa hàng
            </label>
            <Select
              size="large"
              placeholder="Chọn cửa hàng"
              value={selectedStore}
              onChange={setSelectedStore}
              style={{ width: "100%" }}
            >
              {stores.map((store, index) => {
                let dText = "";
                if (verificationResult?.valid) {
                    const d = calculateDistance(
                        parseFloat(verificationResult.lat),
                        parseFloat(verificationResult.lon),
                        parseFloat(store.lat),
                        parseFloat(store.lng || store.lon)
                    );
                    dText = ` - ${d.toFixed(2)} km`;
                }
                return (
                  <Option key={store.branch_id || index} value={store.branch_id}>
                    {store.name} {dText}
                  </Option>
                );
              })}
            </Select>
          </div>
        </Row>

        {/* Sản phẩm */}
        <div style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}>
          <h3>Sản phẩm</h3>
          {productInCart.map((item) => (
            <ProductItem key={item.product_id} product={item} />
          ))}
        </div>

        {/* Voucher */}
        <div style={{ marginTop: "20px" }}>
          <label><TagOutlined /> Mã Giảm Giá:</label>
          <Select
            placeholder="Chọn voucher"
            style={{ width: "100%", marginTop: "8px" }}
            value={selectedVoucher?.coupon_id}
            onChange={handleVoucherChange}
            allowClear
          >
            {coupons.map((v) => (
              <Option key={v.coupon_id} value={v.coupon_id} disabled={totalPrice < v.min_purchase}>
                {v.description}
              </Option>
            ))}
          </Select>
        </div>

        {/* Tổng kết tiền */}
        <div style={{ marginTop: "20px", background: "#f9f9f9", padding: "15px" }}>
          <p>Sản phẩm: {totalPrice.toLocaleString()}đ</p>
          <p>Phí ship: {shippingFee.toLocaleString()}đ</p>
          {selectedVoucher && <p>Giảm giá: -{discount.toLocaleString()}đ</p>}
          <h2 style={{ color: "#ff4d4f" }}>Tổng: {finalPrice.toLocaleString()}đ</h2>
          {estimatedDelivery && (
            <p>Giao hàng dự kiến: {estimatedDelivery.totalMinutes} - {estimatedDelivery.totalMinutes + 5} phút</p>
          )}
        </div>

        {/* Thanh toán */}
        <div style={{ marginTop: "20px" }}>
          <h3>Phương thức thanh toán</h3>
          <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod}>
            <Space>
              <Radio value="COD">COD</Radio>
              <Radio value="QR">Chuyển khoản QR</Radio>
            </Space>
          </Radio.Group>
        </div>

        <Button
          type="primary"
          size="large"
          block
          style={{ marginTop: "30px" }}
          onClick={handleSubmit}
          loading={loading || loadingCreateOrder}
        >
          Đặt hàng
        </Button>
      </div>
    </>
  );
}