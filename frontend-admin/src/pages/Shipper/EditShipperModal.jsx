import { useState, useEffect } from 'react';
import '../../components/Common/Modal.css';

const VEHICLE_TYPES = ['Xe máy', 'Ô tô'];
const STATUS_OPTIONS = ['Active', 'Busy', 'Inactive'];

export default function EditShipperModal({ isOpen, onClose, shipper, onSave }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    vehicle: '',
    vehicleType: '',
    status: 'Active',
    note: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (shipper) {
      setForm({
        name: shipper.name || '',
        email: shipper.email || '',
        phone: shipper.phone || '',
        vehicle: shipper.vehicle || '',
        vehicleType: shipper.vehicleType || '',
        status: shipper.status || 'Active',
        note: shipper.note || '',
      });
    }
  }, [shipper]);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.vehicle.trim() || !form.vehicleType) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }
    setError('');
    onSave({ ...shipper, ...form });
  }

  return (
    <div className="modern-modal-overlay" onClick={onClose}>
      <div className="modern-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modern-modal-header">
          <div className="header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
            </svg>
          </div>
          <div className="header-text">
            <h2>Chỉnh sửa shipper</h2>
            <p>Cập nhật thông tin shipper trong hệ thống</p>
          </div>
          <button className="modern-close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5L5 15" stroke="#000000" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M5 5L15 15" stroke="#000000" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="modern-form">
          <div className="form-grid">
            {/* Họ và tên */}
            <div className="modern-form-group">
              <label>
                Họ và tên <span className="required-star">*</span>
              </label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                </svg>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="modern-form-group">
              <label>Email</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
                </svg>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="shipper@bakery.com"
                />
              </div>
            </div>

            {/* Số điện thoại */}
            <div className="modern-form-group">
              <label>
                Số điện thoại <span className="required-star">*</span>
              </label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/>
                </svg>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="0901234567"
                  required
                />
              </div>
            </div>

            {/* Biển số xe */}
            <div className="modern-form-group">
              <label>
                Biển số xe <span className="required-star">*</span>
              </label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" fill="currentColor"/>
                </svg>
                <input
                  type="text"
                  name="vehicle"
                  value={form.vehicle}
                  onChange={handleChange}
                  placeholder="29A-12345"
                  required
                />
              </div>
            </div>

            {/* Loại xe */}
            <div className="modern-form-group">
              <label>
                Loại xe <span className="required-star">*</span>
              </label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill="currentColor"/>
                </svg>
                <select name="vehicleType" value={form.vehicleType} onChange={handleChange} required>
                  <option value="">Chọn loại xe</option>
                  {VEHICLE_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Trạng thái */}
            <div className="modern-form-group">
              <label>Trạng thái</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.3"/>
                  <circle cx="12" cy="12" r="4" fill="currentColor"/>
                </svg>
                <select name="status" value={form.status} onChange={handleChange}>
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>
                      {status === 'Active' ? 'Sẵn sàng' : 
                       status === 'Busy' ? 'Đang giao' : 'Nghỉ việc'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Shipper ID (Read only) */}
            <div className="modern-form-group">
              <label>Mã shipper</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" fill="currentColor"/>
                </svg>
                <input
                  type="text"
                  value={shipper?.shipperId || ''}
                  placeholder="Auto generated"
                  disabled
                  style={{ background: '#f3f4f6', cursor: 'not-allowed' }}
                />
              </div>
            </div>
          </div>

          {/* Ghi chú */}
          <div className="modern-form-group full-width">
            <label>Ghi chú</label>
            <div className="input-wrapper">
              <svg className="input-icon textarea-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
              </svg>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Thêm ghi chú về shipper..."
                rows={3}
              />
            </div>
          </div>

          {error && <div className="modern-error">{error}</div>}

          {/* Actions */}
          <div className="modern-form-actions">
            <button type="button" className="modern-btn modern-btn-cancel" onClick={onClose}>
              Hủy bỏ
            </button>
            <button onClick={handleSubmit} className="modern-btn modern-btn-submit">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" fill="currentColor"/>
              </svg>
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}