import React, { useMemo, useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import AddEmployeeModal from './AddEmployeeModal';
import EditEmployeeModal from './EditEmployeeModal';
import './Employee.css';

const initialEmployees = [
  { id: 231, name: 'Phan Diệu Lê', role: 'CSKH', phone: '0123456789', email: 'example@hus.edu.vn', status: 'Active' },
  { id: 232, name: 'Nguyễn Văn A', role: 'Tiếp tân', phone: '0987654321', email: 'a@hus.edu.vn', status: 'Inactive' },
  { id: 233, name: 'Trần Văn B', role: 'Đầu bếp', phone: '0911222333', email: 'b@hus.edu.vn', status: 'Active' },
  { id: 234, name: 'Nguyễn Văn C', role: 'CSKH', phone: '0123456789', email: 'c@hus.edu.vn', status: 'Active' },
  { id: 235, name: 'Trần Văn D', role: 'Tiếp tân', phone: '0987654321', email: 'd@hus.edu.vn', status: 'Inactive' },
  { id: 236, name: 'Nguyễn Văn E', role: 'Đầu bếp', phone: '0911222333', email: 'e@hus.edu.vn', status: 'Active' },
];

const ROLE_TABS = ['Tất cả', 'CSKH', 'Tiếp tân', 'Đầu bếp'];

export default function Employee() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [activeRole, setActiveRole] = useState('Tất cả');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Stats
  const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter(e => e.status === 'Active').length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [employees]);

  // Filtered data
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchRole = activeRole === 'Tất cả' || emp.role === activeRole;
      const matchStatus = statusFilter === 'all' || emp.status === statusFilter;
      return matchRole && matchStatus;
    });
  }, [employees, activeRole, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const roleCount = role =>
    role === 'Tất cả'
      ? employees.length
      : employees.filter(e => e.role === role).length;

  const handlePageChange = (page) => {
    if(page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  // Add employee
  const handleAddEmployee = (newEmp) => {
    const maxId = employees.reduce((max, e) => Math.max(max, e.id), 0);
    setEmployees(prev => [...prev, { ...newEmp, id: maxId + 1, status: 'Active' }]);
    setIsAddModalOpen(false);
  }

  // Edit employee
  const handleEditClick = (emp) => {
    setEditingEmployee(emp);
    setIsEditModalOpen(true);
  }

  const handleSaveEmployee = (updatedEmp) => {
    setEmployees(prev => prev.map(e => e.id === updatedEmp.id ? updatedEmp : e));
    setIsEditModalOpen(false);
  }

  // Delete employee
  const handleDelete = (id) => {
    if(window.confirm('Bạn có chắc muốn xóa nhân viên này?')) {
      setEmployees(prev => prev.filter(e => e.id !== id));
    }
  }

  return (
    <div className="employee-container">
      {/* Title */}
      <div className="employee-title">
        <h2>Employee Overview</h2>
        <p>Nhân viên – Chi nhánh đang chọn</p>
      </div>

      {/* Stats */}
      <div className="stat-cards">
        <div className="stat-card">
          <p>Tổng nhân viên</p>
          <h3>{stats.total}</h3>
        </div>
        <div className="stat-card">
          <p>Hoạt động</p>
          <h3>{stats.active}</h3>
        </div>
        <div className="stat-card">
          <p>Inactive</p>
          <h3>{stats.inactive}</h3>
        </div>
      </div>

      {/* Tabs + Actions */}
      <div className="tab-action-bar">
        <div className="role-tabs">
          {ROLE_TABS.map(role => (
            <div
              key={role}
              className={`role-tab ${activeRole === role ? 'active' : ''}`}
              onClick={() => { setActiveRole(role); setCurrentPage(1); }}
            >
              {role} ({roleCount(role)})
            </div>
          ))}
        </div>

        <div className="right-actions">
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Active">Hoạt động</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button className="add-btn" onClick={() => setIsAddModalOpen(true)}>
            <FiPlus />
            Thêm nhân viên
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="employee-table">
        <thead>
          <tr>
            <th>EmployeeID</th>
            <th>Họ và tên</th>
            <th>Vai trò</th>
            <th>Số điện thoại</th>
            <th>Email</th>
            <th>Trạng thái</th>
            <th className="action-col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedEmployees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.role}</td>
              <td>{emp.phone}</td>
              <td>{emp.email}</td>
              <td>
                <span className={`status ${emp.status.toLowerCase()}`}>
                  {emp.status === 'Active' ? 'Hoạt động' : 'Inactive'}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button className="icon-btn edit" onClick={() => handleEditClick(emp)}>
                    <FiEdit2 />
                  </button>
                  <button className="icon-btn delete" onClick={() => handleDelete(emp.id)}>
                    <FiTrash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage-1)} disabled={currentPage===1}>Prev</button>
        {Array.from({length: totalPages}, (_, i) => i+1).map(page => (
          <button
            key={page}
            className={currentPage===page ? 'active' : ''}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
        <button onClick={() => handlePageChange(currentPage+1)} disabled={currentPage===totalPages}>Next</button>
      </div>

      {/* Modals */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddEmployee}
      />

      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        employee={editingEmployee}
        onSave={handleSaveEmployee}
      />
    </div>
  );
}
