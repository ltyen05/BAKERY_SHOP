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
  Col,
} from "antd";
import {
  EnvironmentOutlined,
  CheckCircleOutlined,
  ShopOutlined,
  PhoneOutlined,
  UserOutlined,
  TagOutlined,
} from "@ant-design/icons";
import logo from "../assets/logo-noText.svg";
import { useLocation } from "react-router-dom";
import ProductItem from "../components/Product/ProductItem";
import Voucher from "../components/Voucher/Voucher";
import cod from "../assets/cod.svg";
import qrCodeImg from "../assets/QR.svg";
import { useOrder } from "../context/OrderContext";
const { TextArea } = Input;
const { Option } = Select;

export default function ShippingAddressForm() {
  const location = useLocation();
  const {
    products = [],
    totalPrice = 0,
    selectedVoucher: initialVoucher = null,
  } = location.state || {};

  const [receiverName, setReceiverName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [searchingHints, setSearchingHints] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [distance, setDistance] = useState(null);
  const { selectedVoucher, setSelectedVoucher } = useOrder();
  // ===== Voucher =====

  const voucherList = [
    { id: 1, discount: 50000, minOrder: 300000, expiryDate: "31/12/2025" },
    { id: 2, discount: 100000, minOrder: 600000, expiryDate: "31/01/2026" },
  ];

  // Kiểm tra voucher khi vào page
  useEffect(() => {
    // Kiểm tra voucher có trong danh sách không
    const voucher = selectedVoucher;
    console.log(voucher);
    if (!voucher) {
      message.warning("Voucher không tồn tại!");
      console.log("Voucher không tồn tại!");
      return;
    }

    // Kiểm tra điều kiện đơn hàng tối thiểu
    if (totalPrice < voucher.minOrder) {
      setSelectedVoucher(null);
      message.warning(
        `Voucher yêu cầu đơn hàng tối thiểu ${voucher.minOrder.toLocaleString()}đ. Voucher đã bị hủy.`
      );
      console.log(
        `Voucher yêu cầu đơn hàng tối thiểu ${voucher.minOrder.toLocaleString()}đ. Voucher đã bị hủy.`
      );
      return;
    }

    // Voucher hợp lệ
    setSelectedVoucher(voucher);
    message.success("Đã áp dụng voucher!");
  }, [totalPrice]);
  const getShippingFee = (distance) => {
    if (distance < 2) return 10000;
    if (distance < 4) return 16000;
    if (distance < 8) return 25000;
    return 35000; // ≥ 8km (tuỳ chỉnh)
  };
  const finalPrice = selectedVoucher
    ? Math.max(
        totalPrice - selectedVoucher.discount + getShippingFee(distance),
        0
      )
    : totalPrice + getShippingFee(distance);

  // Danh sách cửa hàng mẫu
  const stores = [
    {
      id: 1,
      name: "Chi nhánh Đống Đa",
      address: "Đường Láng, Đống Đa, Hà Nội",
      lat: 21.0134,
      lon: 105.8078,
    },
    {
      id: 2,
      name: "Chi nhánh Cầu Giấy",
      address: "Trần Duy Hưng, Cầu Giấy, Hà Nội",
      lat: 21.0285,
      lon: 105.7938,
    },
    {
      id: 3,
      name: "Chi nhánh Hoàn Kiếm",
      address: "Hàng Bài, Hoàn Kiếm, Hà Nội",
      lat: 21.0245,
      lon: 105.8412,
    },
  ];

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
      const store = stores.find((s) => s.id === selectedStore);
      if (store) {
        const dist = calculateDistance(
          parseFloat(verificationResult.lat),
          parseFloat(verificationResult.lon),
          store.lat,
          store.lon
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
        message.warning("Không tìm thấy địa chỉ này!");
      }
    } catch (error) {
      console.error("Lỗi khi xác thực địa chỉ:", error);
      message.error("Không thể xác thực địa chỉ. Vui lòng thử lại!");
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = () => {
    if (!receiverName.trim()) {
      message.error("Vui lòng nhập tên người nhận!");
      return;
    }
    if (!phoneNumber.trim()) {
      message.error("Vui lòng nhập số điện thoại!");
      return;
    }
    if (!/^[0-9]{10,11}$/.test(phoneNumber.trim())) {
      message.error("Số điện thoại không hợp lệ (10-11 chữ số)!");
      return;
    }
    if (!address.trim()) {
      message.error("Vui lòng nhập địa chỉ nhận hàng!");
      return;
    }
    if (!verificationResult || !verificationResult.valid) {
      message.warning("Vui lòng xác thực địa chỉ trước khi lưu!");
      return;
    }
    if (!selectedStore) {
      message.warning("Vui lòng chọn cửa hàng giao hàng!");
      return;
    }

    // Kiểm tra voucher trước khi submit
    if (selectedVoucher && totalPrice < selectedVoucher.minOrder) {
      message.error("Voucher không còn đủ điều kiện áp dụng!");
      setSelectedVoucher(null);
      return;
    }

    setLoading(true);
    const store = stores.find((s) => s.id === selectedStore);

    console.log("Đơn hàng:", {
      receiverName,
      phoneNumber,
      address,
      verification: verificationResult,
      store: store,
      distance: distance ? distance.toFixed(2) + " km" : null,
      voucher: selectedVoucher,
      products,
      finalPrice,
      paymentMethod,
    });

    setTimeout(() => {
      message.success("Đã lưu thông tin đơn hàng thành công!");
      setLoading(false);
    }, 1000);
  };

  // Xử lý khi user chọn voucher
  const handleVoucherChange = (voucherId) => {
    if (!voucherId) {
      setSelectedVoucher(null);
      return;
    }

    const voucher = voucherList.find((v) => v.id === voucherId);
    if (totalPrice < voucher.minOrder) {
      message.warning(
        `Đơn hàng tối thiểu ${voucher.minOrder.toLocaleString()}đ`
      );
      return;
    }
    setSelectedVoucher(voucher);
    message.success("Đã áp dụng voucher!");
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "24px" }}>
        Thông Tin Đặt Hàng
      </h1>

      <Row style={{ width: "100%", textAlign: "start", marginBottom: "16px" }}>
        <div style={{ width: "100%" }}>
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
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

      <Row style={{ width: "100%", textAlign: "start", marginBottom: "16px" }}>
        <div style={{ width: "100%" }}>
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
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

      <Row style={{ width: "100%", textAlign: "start", marginBottom: "16px" }}>
        <div style={{ width: "100%", position: "relative" }}>
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
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

      <Row style={{ width: "100%", textAlign: "start", marginBottom: "48px" }}>
        <div style={{ width: "100%" }}>
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
          >
            <ShopOutlined /> Chọn cửa hàng
          </label>
          <Select
            size="large"
            placeholder="Chọn cửa hàng giao hàng"
            style={{ width: "100%" }}
            value={selectedStore}
            onChange={setSelectedStore}
            className="newHeight"
          >
            {stores.map((store) => {
              let distanceText = "";
              if (verificationResult && verificationResult.valid) {
                const dist = calculateDistance(
                  parseFloat(verificationResult.lat),
                  parseFloat(verificationResult.lon),
                  store.lat,
                  store.lon
                );
                distanceText = ` - ${dist.toFixed(2)} km`;
              }
              return (
                <Option key={store.id} value={store.id}>
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

        {products.map((productItem) => (
          <ProductItem key={productItem.id} product={productItem} />
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
          value={selectedVoucher?.id}
          onClear={() => setSelectedVoucher(null)}
          onChange={handleVoucherChange}
          onSearch={(value) => {
            const voucher = voucherList.find(
              (v) => v.code?.toLowerCase() === value.toLowerCase()
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
          {voucherList.map((voucher) => (
            <Select.Option
              key={voucher.id}
              value={voucher.id}
              disabled={totalPrice < voucher.minOrder}
              label={
                voucher.discount <= 1
                  ? `Giảm ${
                      voucher.discount
                    }% cho đơn từ ${voucher.minOrder.toLocaleString()}đ`
                  : `Giảm ${voucher.discount.toLocaleString()}đ cho đơn từ ${voucher.minOrder.toLocaleString()}đ`
              }
            >
              <div className="mt-3">
                <Voucher
                  voucher={voucher}
                  onSelect={setSelectedVoucher}
                  disabled={totalPrice < voucher.minOrder}
                />
              </div>
              {totalPrice < voucher.minOrder && " (Không đủ điều kiện)"}
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
            <span className="info-value">
              - {selectedVoucher.discount.toLocaleString()}đ
            </span>
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
      </div>
      <div className="mb-6 pt-6" style={{ borderTop: "1px solid #2929293e" }}>
        <h1>Phương thức thanh toán</h1>

        <Radio.Group
          className="radio-vertical mt-3"
          onChange={(e) => setPaymentMethod(e.target.value)}
          value={paymentMethod}
          style={{ width: "100%" }}
        >
          <Space
            style={{
              width: "100%",
              justifyContent: "space-around",
            }}
            className="fl"
          >
            <Radio value="cod">
              <img src={cod} alt="COD" style={{ width: "130px" }} />
              <p>Thanh toán khi nhận hàng (COD)</p>
            </Radio>

            <Radio value="qr">
              <img src={qrCodeImg} alt="QR Code" style={{ width: "130px" }} />
              <p>Thanh toán bằng QR Code</p>
            </Radio>
          </Space>
        </Radio.Group>

        {/* Hiện QR Code khi chọn */}
        {paymentMethod === "qr" && (
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
        >
          Đặt hàng
        </Button>
      </div>
    </div>
  );
}
