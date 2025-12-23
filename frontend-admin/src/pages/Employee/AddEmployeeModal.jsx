import React, { useState } from 'react';
import './AddEmployeeModal.css';

const ROLE_OPTIONS = ['CSKH', 'Tiếp tân', 'Đầu bếp'];
const STATUS_OPTIONS = ['Active', 'Inactive'];

export default function AddEmployeeModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    status: 'Active',
    address: '',
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Basic validation
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.role) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }
    setError('');
    onAdd(form);
    setForm({
      name: '',
      email: '',
      phone: '',
      role: '',
      status: 'Active',
      address: '',
    });
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <header>
          <h3>Thêm nhân viên mới</h3>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">&times;</button>
        </header>

        <form onSubmit={handleSubmit} className="add-employee-form">
          <div className="form-row">
            <label htmlFor="name">Họ và tên<span className="required">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="email">Email<span className="required">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Nhập email"
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="phone">Số điện thoại<span className="required">*</span></label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="role">Vai trò<span className="required">*</span></label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Chọn vai trò</option>
              {ROLE_OPTIONS.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="status">Trạng thái</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              {STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>{status === 'Active' ? 'Hoạt động' : 'Không hoạt động'}</option>
              ))}
            </select>
          </div>

          <div className="form-row full-width">
            <label htmlFor="address">Địa chỉ</label>
            <textarea
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Nhập địa chỉ"
              rows={3}
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <div className="form-actions">
            <button type="button" className="btn cancel" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn submit">Thêm nhân viên</button>
          </div>
        </form>
      </div>
    </div>
  );
}
