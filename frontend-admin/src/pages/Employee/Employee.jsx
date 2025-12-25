import React, { useMemo, useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiDownload, FiChevronUp, FiChevronDown, FiFilter } from 'react-icons/fi';
import AddEmployeeModal from './AddEmployeeModal';
import EditEmployeeModal from './EditEmployeeModal';
import './Employee.css';

// Generate more sample data
const generateEmployees = () => {
  const roles = ['CSKH', 'Tiếp tân', 'Đầu bếp'];
  const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Phan', 'Vũ', 'Đặng', 'Bùi', 'Đỗ'];
  const middleNames = ['Văn', 'Thị', 'Hồng', 'Minh', 'Thu', 'Đức', 'Quốc', 'Anh'];
  const lastNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
  
  const employees = [
    { id: 231, name: 'Phan Diệu Lê', role: 'CSKH', phone: '0123456789', email: 'example@hus.edu.vn', status: 'Active' },
    { id: 232, name: 'Nguyễn Văn A', role: 'Tiếp tân', phone: '0987654321', email: 'a@hus.edu.vn', status: 'Inactive' },
    { id: 233, name: 'Trần Văn B', role: 'Đầu bếp', phone: '0911222333', email: 'b@hus.edu.vn', status: 'Active' },
    { id: 234, name: 'Nguyễn Văn C', role: 'CSKH', phone: '0123456789', email: 'c@hus.edu.vn', status: 'Active' },
    { id: 235, name: 'Trần Văn D', role: 'Tiếp tân', phone: '0987654321', email: 'd@hus.edu.vn', status: 'Inactive' },
    { id: 236, name: 'Nguyễn Văn E', role: 'Đầu bếp', phone: '0911222333', email: 'e@hus.edu.vn', status: 'Active' },
  ];

  // Add more employees for pagination demo
  for (let i = 7; i <= 25; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const middleName = middleNames[Math.floor(Math.random() * middleNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${middleName} ${lastName}`;
    const role = roles[Math.floor(Math.random() * roles.length)];
    const status = Math.random() > 0.3 ? 'Active' : 'Inactive';
    const letter = String.fromCharCode(96 + i);
    
    employees.push({
      id: 230 + i,
      name,
      role,
      phone: `09${Math.floor(Math.random() * 100000000)}`.slice(0, 10),
      email: `${letter}@hus.edu.vn`,
      status
    });
  }
  
  return employees;
};

const ROLE_TABS = ['Tất cả', 'CSKH', 'Tiếp tân', 'Đầu bếp'];

export default function Employee() {
  const [employees, setEmployees] = useState(generateEmployees());
  const [activeRole, setActiveRole] = useState('Tất cả');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
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

  // Sort
  const sortedEmployees = useMemo(() => {
    if (!sortConfig.key) return filteredEmployees;
    
    return [...filteredEmployees].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredEmployees, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedEmployees.length / rowsPerPage);
  const paginatedEmployees = sortedEmployees.slice(
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
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Add employee
  const handleAddEmployee = (newEmp) => {
    const maxId = employees.reduce((max, e) => Math.max(max, e.id), 0);
    setEmployees(prev => [...prev, { ...newEmp, id: maxId + 1, status: 'Active' }]);
    setIsAddModalOpen(false);
  };

  // Edit employee
  const handleEditClick = (emp) => {
    setEditingEmployee(emp);
    setIsEditModalOpen(true);
  };

  const handleSaveEmployee = (updatedEmp) => {
    setEmployees(prev => prev.map(e => e.id === updatedEmp.id ? updatedEmp : e));
    setIsEditModalOpen(false);
  };

  // Delete employee
  const handleDelete = (id) => {
    if(window.confirm('Bạn có chắc muốn xóa nhân viên này?')) {
      setEmployees(prev => prev.filter(e => e.id !== id));
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Họ và tên', 'Vai trò', 'Số điện thoại', 'Email', 'Trạng thái'];
    const csvContent = [
      headers.join(','),
      ...filteredEmployees.map(emp => 
        [emp.id, emp.name, emp.role, emp.phone, emp.email, emp.status].join(',')
      )
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'employees.csv';
    link.click();
  };

  // Get initials for avatar
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />;
  };

  return (
    <div className="employee-container">
      {/* Header */}
      <div className="employee-header">
        <div>
          <h2 className="employee-title">Employee Overview</h2>
          <p className="employee-subtitle">Nhân viên – Chi nhánh đang chọn</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card-blue">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div>
            <p className="stat-label">Tổng nhân viên</p>
            <h3 className="stat-value">{stats.total}</h3>
          </div>
        </div>
        
        <div className="stat-card stat-card-green">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div>
            <p className="stat-label">Hoạt động</p>
            <h3 className="stat-value">{stats.active}</h3>
          </div>
        </div>
        
        <div className="stat-card stat-card-red">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <div>
            <p className="stat-label">Inactive</p>
            <h3 className="stat-value">{stats.inactive}</h3>
          </div>
        </div>
      </div>

      {/* Tabs + Actions Bar */}
      <div className="tabs-action-bar">
        <div className="role-tabs">
          {ROLE_TABS.map(role => (
            <div
              key={role}
              className={`role-tab ${activeRole === role ? 'active' : ''}`}
              onClick={() => { setActiveRole(role); setCurrentPage(1); }}
            >
              {role} <span className="tab-count">({roleCount(role)})</span>
            </div>
          ))}
        </div>
        
        <div className="right-actions">
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="status-select"
          >
            <option value="all">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button className="export-btn" onClick={handleExportCSV}>
            <FiDownload />
            Export CSV
          </button>

          <button className="add-btn" onClick={() => setIsAddModalOpen(true)}>
            <FiPlus />
            Thêm nhân viên
          </button>
        </div>
      </div>

      {/* Table Container with Scroll */}
      <div className="table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} className="sortable">
                <div className="th-content">
                  EmployeeID {getSortIcon('id')}
                </div>
              </th>
              <th onClick={() => handleSort('name')} className="sortable">
                <div className="th-content">
                  Họ và tên {getSortIcon('name')}
                </div>
              </th>
              <th onClick={() => handleSort('role')} className="sortable">
                <div className="th-content">
                  Vai trò {getSortIcon('role')}
                </div>
              </th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th onClick={() => handleSort('status')} className="sortable">
                <div className="th-content">
                  Trạng thái {getSortIcon('status')}
                </div>
              </th>
              <th className="action-col">Edit</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.map(emp => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>
                  <div className="name-cell">
                    <div className="avatar">{getInitials(emp.name)}</div>
                    <span>{emp.name}</span>
                  </div>
                </td>
                <td>
                  <span className="role-badge">{emp.role}</span>
                </td>
                <td>{emp.phone}</td>
                <td>{emp.email}</td>
                <td>
                  <span className={`status ${emp.status.toLowerCase()}`}>
                    {emp.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn edit" onClick={() => handleEditClick(emp)} title="Chỉnh sửa">
                      <FiEdit2 />
                    </button>
                    <button className="icon-btn delete" onClick={() => handleDelete(emp.id)} title="Xóa">
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Prev
          </button>
          
          {Array.from({length: totalPages}, (_, i) => i + 1).map(page => {
            // Show first, last, current and adjacent pages
            if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                >
                  {page}
                </button>
              );
            } else if (page === currentPage - 2 || page === currentPage + 2) {
              return <span key={page} className="pagination-ellipsis">...</span>;
            }
            return null;
          })}
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
          
          <span className="pagination-info">
            Trang {currentPage} / {totalPages} • {sortedEmployees.length} kết quả
          </span>
        </div>
      )}

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
