import React, { useMemo, useState } from 'react';
import { FaUsers, FaUserCheck, FaUserSlash, FaEdit, FaTrash } from 'react-icons/fa';
import './Employee.css';

const tabs = [
  { key: 'Nhân viên', label: 'Nhân viên', count: 496, icon: <FaUsers /> },
  { key: 'Hoạt động', label: 'Hoạt động', count: 293, icon: <FaUserCheck /> },
  { key: 'Inactive', label: 'Inactive', count: 62, icon: <FaUserSlash /> },
];

const employees = [
  { id: 101, name: 'Starwindee', role: 'CSKH', phone: '0123456789', email: 'abc@gmail.com', status: 'Active' },
  { id: 102, name: 'Minh Anh', role: 'Quản lý đơn hàng', phone: '0987654321', email: 'minh.anh@gmail.com', status: 'Active' },
  { id: 103, name: 'Uyên', role: 'receptionist', phone: '0909090909', email: 'uyen@gmail.com', status: 'Inactive' },
  ...Array(9).fill({ id: 111, name: 'Starwindee', role: 'receptionist', phone: '123456789', email: 'abc@gmail.com', status: 'Active' }),
];

export default function Employee() {
  const [activeTab, setActiveTab] = useState('Nhân viên');

  // lọc theo tab
  const filteredEmployees = useMemo(() => {
    let data = employees;
    if (activeTab === 'Hoạt động') {
      data = data.filter(e => e.status === 'Active');
    } else if (activeTab === 'Inactive') {
      data = data.filter(e => e.status !== 'Active');
    }
    return data;
  }, [activeTab]);

  return (
    
    <div className="employee-container">
      <div className="recent-review-card">
  <h3>Employee Overview</h3>
  <p>Here is Employees in your restaurant</p>
</div>

      {/* Tab cards */}
      <div className="tab-cards">
        {tabs.map(tab => (
          <div
            key={tab.key}
            className={`tab-card ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <div className="tab-icon">{tab.icon}</div>
            <div>
              <h3>{tab.label}</h3>
              <p>{tab.count} người</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bảng nhân viên */}
      <table className="employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Role</th>
            <th>Số điện thoại</th>
            <th>Email</th>
            <th>Status</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp, index) => (
            <tr key={`${emp.id}-${index}`}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.role}</td>
              <td>{emp.phone}</td>
              <td>{emp.email}</td>
              <td>
                <span className={emp.status === 'Active' ? 'status-active' : 'status-inactive'}>
                  {emp.status}
                </span>
              </td>
              <td>
                <button className="icon-btn edit-btn" title="Chỉnh sửa">
                  <FaEdit />
                </button>
                <button className="icon-btn delete-btn" title="Xóa">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
