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
  console.log("branches:", branches);
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
  // ===== Voucher =====
  const getEstimatedDeliveryTime = (distance) => {
    if (!distance) return null;

    const roundedKm = Math.ceil(distance); // làm tròn lên
    const totalMinutes = BASE_TIME + roundedKm * PER_KM_TIME;

    return {
      roundedKm,
      totalMinutes,
    };
  };
  const estimatedDelivery = getEstimatedDeliveryTime(distance);
  // Kiểm tra voucher khi vào page
  useEffect(() => {
    // Kiểm tra voucher có trong danh sách không

    console.log(selectedVoucher);
    if (!selectedVoucher) {
      return;
    }

    // Kiểm tra điều kiện đơn hàng tối thiểu
    if (totalPrice < selectedVoucher.min_purchase) {
      setSelectedVoucher(null);
      messageApi.warning(
        `Voucher yêu cầu đơn hàng tối thiểu ${selectedVoucher.min_purchase.toLocaleString()}đ. Voucher đã bị hủy.`
      );

      return;
    }

    // Voucher hợp lệ
    setSelectedVoucher(selectedVoucher);
    message.success("Đã áp dụng voucher!");
  }, [totalPrice]);
  const getShippingFee = (distance) => {
    if (distance < 2) return 10000;
    if (distance < 4) return 16000;
    if (distance < 8) return 25000;
    return 35000; // ≥ 8km (tuỳ chỉnh)
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
  // Danh sách cửa hàng mẫu
  const stores = Array.isArray(branches) ? branches : (branches?.details || []);
  // Tính khoảng cách giữa 2 tọa độ (công thức Haversine)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Bán kính trái đất (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  // Tính khoảng cách khi có địa chỉ và cửa hàng
  useEffect(() => {
    if (verificationResult && verificationResult.valid && selectedStore) {
      const store = stores.find((s) => s.branch_id === selectedStore);
      console.log("Danh sách stores sau khi sửa:", stores);
      if (store) {
        const dist = calculateDistance(
          parseFloat(verificationResult.lat),
          parseFloat(verificationResult.lon),
          store.lat,
          store.lng
        );
        setDistance(dist);
      }
    } else {
      setDistance(null);
    }
  }, [verificationResult, selectedStore]);

  // Debounce để không gọi API liên tục khi gõ
  useEffect(() => {
    if (address.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchAddressSuggestions(address);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [address]);

  // Tìm kiếm gợi ý địa chỉ
  const searchAddressSuggestions = async (query) => {
    if (query.trim().length < 3) return;

    setSearchingHints(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query + ", Vietnam"
        )}&format=json&addressdetails=1&limit=5`,
        {
          headers: {
            "User-Agent": "ShippingAddressVerification/1.0",
          },
        }
      );
      const data = await response.json();
      if (data && data.length > 0) {
        setSuggestions(
          data.map((item) => ({
            displayName: item.display_name,
            lat: item.lat,
            lon: item.lon,
            address: item.address,
          }))
        );
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Lỗi khi tìm gợi ý:", error);
    } finally {
      setSearchingHints(false);
    }
  };

  // Chọn địa chỉ từ gợi ý
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
    message.success("Đã chọn địa chỉ!");
  };

  // Xác thực địa chỉ thủ công
  const verifyAddress = async () => {
    if (!address.trim()) {
      message.error("Vui lòng nhập địa chỉ!");
      return;
    }

    setVerifying(true);
    setVerificationResult(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          address + ", Vietnam"
        )}&format=json&addressdetails=1&limit=1`,
        {
          headers: {
            "User-Agent": "ShippingAddressVerification/1.0",
          },
        }
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        setVerificationResult({
          valid: true,
          displayName: result.display_name,
          lat: result.lat,
          lon: result.lon,
          address: result.address,
        });
        message.success("Địa chỉ hợp lệ!");
      } else {
        setVerificationResult({
          valid: false,
          message: "Không tìm thấy địa chỉ này. Vui lòng kiểm tra lại!",
        });
        messageApi.warning("Không tìm thấy địa chỉ này!");
      }
    } catch (error) {
      messageApi.error("Không thể xác thực địa chỉ. Vui lòng thử lại!");
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async () => {
    if (!receiverName.trim()) {
      messageApi.error("Vui lòng nhập tên người nhận!");
      return;
    }
    if (!phoneNumber.trim()) {
      messageApi.error("Vui lòng nhập số điện thoại!");
      return;
    }
    if (!/^[0-9]{10,11}$/.test(phoneNumber.trim())) {
      messageApi.error("Số điện thoại không hợp lệ (10-11 chữ số)!");
      return;
    }
    if (!address.trim()) {
      messageApi.error("Vui lòng nhập địa chỉ nhận hàng!");
      return;
    }
    if (!verificationResult || !verificationResult.valid) {
      messageApi.warning("Vui lòng xác thực địa chỉ trước khi đặt hàng!");
      return;
    }
    if (!selectedStore) {
      messageApi.warning("Vui lòng chọn cửa hàng giao hàng!");
      return;
    }

    // Kiểm tra voucher trước khi submit
    if (selectedVoucher && totalPrice < selectedVoucher.min_purchase) {
      messageApi.error("Voucher không còn đủ điều kiện áp dụng!");
      setSelectedVoucher(null);
      return;
    }
    setLoading(true);
    try {
      stores.find((s) => s.branch_id === selectedStore);

      // ===== CALL API CREATE ORDER =====
      const res = await create_order({
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
      console.error(err);
      messageApi.error(err.message || "Đặt hàng thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi user chọn voucher
  const handleVoucherChange = (voucherId) => {
    if (!voucherId) {
      setSelectedVoucher(null);
      return;
    }

    const voucher = coupons.find((v) => v.coupon_id === voucherId);
    if (totalPrice < voucher.min_purchase) {
      messageApi.warning(
        `Đơn hàng tối thiểu ${voucher.min_purchase.toLocaleString()}đ`
      );
      return;
    }
    setSelectedVoucher(voucher);
  };

  return (
    <>
      {contextHolder}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "24px" }}>
          Thông Tin Đặt Hàng
        </h1>

        <Row
          style={{ width: "100%", textAlign: "start", marginBottom: "16px" }}
        >
          <div style={{ width: "100%" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
              }}
            >
              <UserOutlined /> Tên người nhận
            </label>
            <Input
              size="large"
              placeholder="Nhập tên người nhận"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              style={{ fontSize: "16px" }}
            />
          </div>
        </Row>

        <Row
          style={{ width: "100%", textAlign: "start", marginBottom: "16px" }}
        >
          <div style={{ width: "100%" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
              }}
            >
              <PhoneOutlined /> Số điện thoại
            </label>
            <Input
              size="large"
              placeholder="Nhập số điện thoại"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              maxLength={11}
              style={{ fontSize: "16px" }}
            />
          </div>
        </Row>

        <Row
          style={{ width: "100%", textAlign: "start", marginBottom: "16px" }}
        >
          <div style={{ width: "100%", position: "relative" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
              }}
            >
              <EnvironmentOutlined /> Địa chỉ nhận hàng
            </label>
            <TextArea
              rows={3}
              size="large"
              placeholder="Nhập địa chỉ chi tiết"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setVerificationResult(null);
              }}
              onBlur={() => {
                if (address.trim() && !verificationResult) {
                  verifyAddress();
                }
              }}
              style={{ fontSize: "16px" }}
            />

            {/* Hiển thị gợi ý */}
            {suggestions.length > 0 && (
              <Card
                size="small"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                  marginTop: "4px",
                  maxHeight: "300px",
                  overflow: "auto",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                <List
                  size="small"
                  dataSource={suggestions}
                  renderItem={(item) => (
                    <List.Item
                      style={{
                        cursor: "pointer",
                        padding: "8px 12px",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#f0f0f0")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                      onClick={() => selectSuggestion(item)}
                    >
                      <div>
                        <div style={{ fontWeight: "500", marginBottom: "4px" }}>
                          <EnvironmentOutlined
                            style={{ marginRight: "8px", color: "#1890ff" }}
                          />
                          {item.displayName}
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            )}
          </div>
        </Row>

        <Row
          style={{ width: "100%", textAlign: "start", marginBottom: "48px" }}
        >
          <div style={{ width: "100%" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
              }}
            >
              <ShopOutlined /> Chọn cửa hàng
            </label>
            <Select
              size="large"
              placeholder="Chọn cửa hàng giao hàng"
              value={selectedStore}
              onChange={setSelectedStore}
              className="newHeight w100"
            >
              {stores.map((store) => {
                  let distanceText = "";
                  if (verificationResult && verificationResult.valid) {
                    // SỬA TẠI ĐÂY: Thêm kiểm tra tên biến lon/lng/longitude
                    const storeLat = parseFloat(store.lat);
                    const storeLng = parseFloat(store.lng || store.lon || store.longitude);

                    if (!isNaN(storeLat) && !isNaN(storeLng)) {
                      const dist = calculateDistance(
                        parseFloat(verificationResult.lat),
                        parseFloat(verificationResult.lon),
                        storeLat,
                        storeLng
                      );
                      distanceText = ` - ${dist.toFixed(2)} km`;
                    }
                  }
                return (
                  <Option key={store.branch_id || `store-${index}`} value={store.branch_id}>
                    <div>
                      <div
                        className="fl-center"
                        style={{
                          fontWeight: "400",
                          gap: "12px",
                          justifyContent: "flex-start",
                        }}
                      >
                        <img src={logo} alt="logo" style={{ width: "30px" }} />{" "}
                        <div style={{ marginTop: "4px" }}>{store.name}</div>
                        {distanceText && (
                          <span
                            style={{
                              fontSize: "12px",
                              color: " #213547c1",
                              fontWeight: "300",
                              marginTop: "4px",
                            }}
                          >
                            {distanceText}
                          </span>
                        )}
                      </div>
                    </div>
                  </Option>
                );
              })}
            </Select>
          </div>
        </Row>
        <Row
          style={{ width: "100%", textAlign: "start", marginBottom: "24px" }}
        >
          <div style={{ width: "100%" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
              }}
            >
              📝 Ghi chú cho đơn hàng
            </label>
            <TextArea
              rows={3}
              placeholder="Nhập ghi chú"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={200}
              showCount
              style={{ fontSize: "15px" }}
            />
          </div>
        </Row>

        {verifying && (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spin size="large" />
            <div style={{ marginTop: "12px", color: "#666" }}>
              Đang xác thực địa chỉ...
            </div>
          </div>
        )}

        <div className="mb-6 pt-6" style={{ borderTop: "1px solid #2929293e" }}>
          <h1 style={{ marginBottom: "16px" }}>Sản phẩm</h1>

          {productInCart.map((productItem) => (
            <ProductItem key={productItem.product_id} product={productItem} />
          ))}
        </div>
        <div
          className="mb-6 pt-6 "
          style={{
            borderTop: "1px solid #2929293e",
          }}
        >
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
          >
            <TagOutlined /> Mã Giảm Giá:
          </label>
          <Select
            showSearch
            placeholder="Chọn hoặc nhập mã voucher"
            allowClear
            style={{ width: "100%", maxWidth: "400px", height: "45px" }}
            value={selectedVoucher?.coupon_id}
            onClear={() => setSelectedVoucher(null)}
            onChange={handleVoucherChange}
            onSearch={(value) => {
              const voucher = coupons.find(
                (v) => v.description.toLowerCase() === value.toLowerCase()
              );
              if (voucher) {
                setSelectedVoucher(voucher);
              }
            }}
            filterOption={(input, option) =>
              option?.label?.toLowerCase().includes(input.toLowerCase())
            }
            optionLabelProp="label"
          >
            {coupons.map((voucher) => (
              <Select.Option
                key={voucher.coupon_id}
                value={voucher.coupon_id}
                disabled={totalPrice < voucher.min_purchase}
                label={
                  voucher.description +
                  (totalPrice < voucher.min_purchase
                    ? " (Không đủ điều kiện)"
                    : "")
                }
              >
                <div className="mt-3">
                  <Voucher
                    voucher={voucher}
                    onSelect={setSelectedVoucher}
                    disabled={totalPrice < voucher.min_purchase}
                  />
                </div>
                {totalPrice < voucher.min_purchase && " (Không đủ điều kiện)"}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div className="mb-6">
          <div className="info-row">
            <span className="info-label">Tổng tiền sản phẩm: </span>
            <span className="info-value">{totalPrice.toLocaleString()}đ</span>
          </div>
          <div className="info-row">
            <span className="info-label">Tiền vận chuyển: </span>
            <span className="info-value">
              {getShippingFee(distance).toLocaleString()}đ
            </span>
          </div>
          {selectedVoucher && (
            <div className="info-row">
              <span className="info-label">Giảm giá: </span>
              <span className="info-value">- {discount.toLocaleString()}đ</span>
            </div>
          )}

          <div
            style={{
              fontWeight: "500",
              fontSize: "20px",
            }}
            className="info-row pt-3"
          >
            <span className="info-label">Tổng</span>
            <span className="info-value">{finalPrice.toLocaleString()}đ</span>
          </div>
          {estimatedDelivery && (
            <div className="info-row">
              <span className="info-label">Thời gian giao hàng dự kiến: </span>
              <span className="info-value">
                {estimatedDelivery?.totalMinutes} -{" "}
                {estimatedDelivery?.totalMinutes + 5} phút
              </span>
            </div>
          )}
        </div>
        <div className="mb-6 pt-6" style={{ borderTop: "1px solid #2929293e" }}>
          <h1>Phương thức thanh toán</h1>

          <Radio.Group
            className="radio-vertical mt-3 w100"
            onChange={(e) => setPaymentMethod(e.target.value)}
            value={paymentMethod}
          >
            <Space
              style={{
                justifyContent: "space-around",
              }}
              className="fl w100"
            >
              <Radio value="COD">
                <img src={cod} alt="COD" style={{ width: "130px" }} />
                <p>Thanh toán khi nhận hàng (COD)</p>
              </Radio>

              <Radio value="QR">
                <img src={qrCodeImg} alt="QR Code" style={{ width: "130px" }} />
                <p>Thanh toán bằng QR Code</p>
              </Radio>
            </Space>
          </Radio.Group>

          {/* Hiện QR Code khi chọn */}
          {paymentMethod === "QR" && (
            <div className="fl-center mt-6">
              <div>
                <img
                  src="/qr-code.png" // ảnh QR của bạn
                  alt="QR Code"
                  style={{ width: "100%" }}
                />
                <div
                  style={{ marginTop: "8px", fontSize: "13px", color: "#666" }}
                >
                  Quét mã để thanh toán
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ textAlign: "right" }}>
          <Button
            type="btn btn-primary"
            size="large"
            loading={loading}
            onClick={handleSubmit}
            icon={<CheckCircleOutlined />}
            disabled={loadingCreateOrder}
          >
            Đặt hàng
          </Button>
        </div>
      </div>
    </>
  );
}