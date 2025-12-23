import React, { useState, useEffect } from 'react';
import './EmployeeModal.css'; 

const ROLE_OPTIONS = ['CSKH', 'Tiếp tân', 'Đầu bếp'];
const STATUS_OPTIONS = ['Active', 'Inactive'];

export default function EditEmployeeModal({ isOpen, onClose, employee, onSave }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    status: 'Active',
    address: '',
  });

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        role: employee.role || '',
        status: employee.status || 'Active',
        address: employee.address || '',
      });
    }
  }, [employee]);

  if (!isOpen) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Validate cơ bản
    if (!form.name || !form.email || !form.phone || !form.role) return;
    onSave({ ...employee, ...form });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Chỉnh sửa nhân viên</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Họ và tên <span className="required">*</span></label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Nhập họ và tên"/>
          </div>

          <div className="form-row">
            <label>Email <span className="required">*</span></label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Nhập email"/>
          </div>

          <div className="form-row">
            <label>Số điện thoại <span className="required">*</span></label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Nhập số điện thoại"/>
          </div>

          <div className="form-row">
            <label>Vai trò <span className="required">*</span></label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="" disabled>Chọn vai trò</option>
              {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="form-row">
            <label>Trạng thái</label>
            <select name="status" value={form.status} onChange={handleChange}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'Active' ? 'Hoạt động' : 'Không hoạt động'}</option>)}
            </select>
          </div>

          <div className="form-row full-width">
            <label>Địa chỉ</label>
            <textarea name="address" value={form.address} onChange={handleChange} rows={2} placeholder="Nhập địa chỉ"/>
          </div>

          <div className="form-actions">
            <button type="button" className="btn cancel" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn submit">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
}
