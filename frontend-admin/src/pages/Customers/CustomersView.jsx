import { useState } from 'react';
import './CustomersView.css';

const MEMBER_TYPES = ['Thường', 'VIP'];

export default function CustomersView() {
  const [customers, setCustomers] = useState([
    { id: 1, name: 'Nguyễn Văn A', customerId: 'KH001', phone: '0901234567', email: 'nguyenvana@email.com', address: 'Hà Nội', memberType: 'VIP', totalSpent: 5000000, note: 'Khách hàng thân thiết' },
    { id: 2, name: 'Trần Thị B', customerId: 'KH002', phone: '0912345678', email: 'tranthib@email.com', address: 'TP HCM', memberType: 'Thường', totalSpent: 1200000, note: '' },
    { id: 3, name: 'Lê Văn C', customerId: 'KH003', phone: '0923456789', email: 'levanc@email.com', address: 'Đà Nẵng', memberType: 'VIP', totalSpent: 8500000, note: 'Mua số lượng lớn' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredCustomers = customers.filter(customer => {
    const matchSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       customer.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       customer.phone.includes(searchTerm);
    const matchFilter = filterType === 'all' || customer.memberType === filterType;
    return matchSearch && matchFilter;
  });

  function handleAddCustomer(newCustomer) {
    setCustomers([...customers, { ...newCustomer, id: Date.now() }]);
    setIsModalOpen(false);
  }

  function handleDeleteCustomer(id) {
    if (confirm('Bạn có chắc muốn xóa khách hàng này?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  }

  return (
    <div className="customers-container">
      <div className="customers-content">
        {/* Header */}
        <div className="customers-header-card">
          <div className="header-top">
            <div className="header-left">
              <div className="header-icon-wrapper">
                <svg className="header-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="header-text-group">
                <h1 className="header-title">Quản lý khách hàng</h1>
                <p className="header-subtitle">Quản lý thông tin khách hàng và hội viên</p>
              </div>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="btn-add-customer">
              <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm khách hàng
            </button>
          </div>

          {/* Filters */}
          <div className="filters-row">
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mã KH, số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
              <option value="all">Tất cả loại hội viên</option>
              <option value="VIP">VIP</option>
              <option value="Thường">Thường</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-blue">
            <div className="stat-content">
              <div>
                <p className="stat-label">Tổng khách hàng</p>
                <p className="stat-value">{customers.length}</p>
              </div>
              <div className="stat-icon-wrapper stat-icon-blue">
                <svg className="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="stat-card stat-amber">
            <div className="stat-content">
              <div>
                <p className="stat-label">Hội viên VIP</p>
                <p className="stat-value">{customers.filter(c => c.memberType === 'VIP').length}</p>
              </div>
              <div className="stat-icon-wrapper stat-icon-amber">
                <svg className="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="stat-card stat-green">
            <div className="stat-content">
              <div>
                <p className="stat-label">Tổng doanh thu từ KH</p>
                <p className="stat-value">
                  {(customers.reduce((sum, c) => sum + c.totalSpent, 0) / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="stat-icon-wrapper stat-icon-green">
                <svg className="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Table */}
        <div className="table-card">
          <div className="table-wrapper">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>Mã KH</th>
                  <th>Họ và tên</th>
                  <th>Số điện thoại</th>
                  <th>Email</th>
                  <th>Địa chỉ</th>
                  <th>Loại HV</th>
                  <th>Tổng chi tiêu</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <span className="customer-id">{customer.customerId}</span>
                    </td>
                    <td>
                      <div className="customer-name-cell">
                        <div className="customer-avatar">
                          {customer.name.charAt(0)}
                        </div>
                        <span className="customer-name">{customer.name}</span>
                      </div>
                    </td>
                    <td className="text-gray">{customer.phone}</td>
                    <td className="text-gray">{customer.email}</td>
                    <td className="text-gray">{customer.address}</td>
                    <td>
                      <span className={`badge ${customer.memberType === 'VIP' ? 'badge-vip' : 'badge-regular'}`}>
                        {customer.memberType}
                      </span>
                    </td>
                    <td>
                      <span className="total-spent">
                        {customer.totalSpent.toLocaleString('vi-VN')}đ
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn action-view">
                          <svg className="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="action-btn action-edit">
                          <svg className="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => handleDeleteCustomer(customer.id)} className="action-btn action-delete">
                          <svg className="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCustomers.length === 0 && (
              <div className="empty-state">
                <svg className="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="empty-text">Không tìm thấy khách hàng nào</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      {isModalOpen && (
        <AddCustomerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddCustomer}
        />
      )}
    </div>
  );
}

// Add Customer Modal Component
function AddCustomerModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState({
    name: '',
    customerId: '',
    phone: '',
    email: '',
    address: '',
    memberType: 'Thường',
    totalSpent: 0,
    note: '',
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.customerId.trim() || !form.phone.trim()) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }
    setError('');
    onAdd(form);
    setForm({
      name: '',
      customerId: '',
      phone: '',
      email: '',
      address: '',
      memberType: 'Thường',
      totalSpent: 0,
      note: '',
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-icon-wrapper">
              <svg className="modal-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h2 className="modal-title">Thêm khách hàng mới</h2>
              <p className="modal-subtitle">Điền thông tin để thêm khách hàng vào hệ thống</p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <svg className="close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="modal-form">
          <div className="form-grid-2">
            <div className="form-field">
              <label className="form-label">
                Họ và tên <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
                className="form-input"
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">
                Mã khách hàng <span className="required">*</span>
              </label>
              <input
                type="text"
                name="customerId"
                value={form.customerId}
                onChange={handleChange}
                placeholder="KH001"
                className="form-input"
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">
                Số điện thoại <span className="required">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="0901234567"
                className="form-input"
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="form-input"
              />
            </div>

            <div className="form-field full-width">
              <label className="form-label">Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố"
                className="form-input"
              />
            </div>

            <div className="form-field">
              <label className="form-label">Loại hội viên</label>
              <select name="memberType" value={form.memberType} onChange={handleChange} className="form-select">
                <option value="Thường">Thường</option>
                <option value="VIP">VIP</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Tổng chi tiêu (VNĐ)</label>
              <input
                type="number"
                name="totalSpent"
                value={form.totalSpent}
                onChange={handleChange}
                placeholder="0"
                className="form-input"
              />
            </div>

            <div className="form-field full-width">
              <label className="form-label">Ghi chú</label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Thêm ghi chú về khách hàng..."
                rows={3}
                className="form-textarea"
              />
            </div>
          </div>

          {error && (
            <div className="error-message">
              <svg className="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Hủy bỏ
            </button>
            <button onClick={handleSubmit} className="btn-submit">
              <svg className="btn-submit-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm khách hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}