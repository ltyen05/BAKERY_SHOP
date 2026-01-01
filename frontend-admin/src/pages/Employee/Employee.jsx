// ===============================================
// Location: src/pages/Employee/Employee.jsx
// ===============================================
import React, { useState, useEffect } from 'react';
import { Tag, Space, Button, Tooltip, Modal, Alert } from 'antd';
import { FiSearch, FiDownload, FiPlus, FiUser, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import StatsCard from '../../components/StatsCard/StatsCard';
import DataTable from '../../components/Table/Table';
import FormModal from '../../components/FormModal/FormModal';
import { useEmployee } from './useEmployee';
import branchApi from '../../api/branchApi';
import { 
  ROLE_TABS, 
  EMPLOYEE_FIELDS, 
  EMPLOYEE_EDIT_FIELDS,
  STATS_CONFIG,
  formatCurrency,
  getRoleColor,
  getBranchName,
  getInitials
} from './employeeConstants';
import './Employee.css';

const { confirm } = Modal;

const Employee = () => {
  const {
    filteredEmployees,
    stats,
    loading,
    activeRole,
    searchQuery,
    currentPage,
    currentBranchId, // Lay tu useEmployee
    addEmployee,
    updateEmployee,
    deleteEmployee,
    roleCount,
    getHeaderTitle,
    getHeaderSubtitle,
    setCurrentPage,
    handleRoleChange,
    handleSearchChange,
  } = useEmployee();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [branchError, setBranchError] = useState(null);

  // FETCH BRANCHES - Only for add mode
  useEffect(() => {
    console.log('Action: Fetching branches...');
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setLoadingBranches(true);
    setBranchError(null);
    
    const result = await branchApi.getAllBranches();
    
    if (result.success && result.data) {
      const branchOptions = result.data.map(branch => ({
        value: String(branch.branch_id),
        label: `[${branch.branch_id}] ${branch.name || branch.branch_name}`
      }));
      
      setBranches(branchOptions);
      console.log('Success: Branches loaded:', branchOptions);
    } else {
      const errorMsg = 'Không thể tải danh sách chi nhánh. Vui lòng thử lại.';
      setBranchError(errorMsg);
      console.error('Error: Failed to load branches:', result.message);
      Modal.error({
        title: 'Lỗi tải dữ liệu',
        content: errorMsg,
        centered: true
      });
    }
    
    setLoadingBranches(false);
  };

  const handleAddClick = () => {
    if (branchError || branches.length === 0) {
      Modal.warning({
        title: 'Chưa thể thêm nhân viên',
        content: 'Vui lòng đợi tải xong danh sách chi nhánh hoặc thử làm mới trang.',
        centered: true
      });
      return;
    }
    
    setModalMode('add');
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (employee) => {
    setModalMode('edit');
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleSaveEmployee = async (employeeData) => {
    let result;
    
    if (modalMode === 'add') {
      // Auto-fill branch_id from context if missing
      if (!employeeData.branch_id && currentBranchId) {
        employeeData.branch_id = currentBranchId;
        console.log('Auto-fill: branch_id from context:', currentBranchId);
      }
      
      if (!employeeData.branch_id) {
        Modal.error({
          title: 'Thiếu thông tin',
          content: 'Không xác định được chi nhánh. Vui lòng chọn chi nhánh.',
          centered: true
        });
        return;
      }
      
      result = await addEmployee(employeeData);
    } else {
      // Keep existing branch_id in edit mode
      const employeeId = selectedEmployee.employee_id || selectedEmployee.id;
      const updateData = {
        ...employeeData,
        branch_id: selectedEmployee.branch_id
      };
      
      result = await updateEmployee(employeeId, updateData);
    }
    
    if (result?.success) {
      handleCloseModal();
    }
  };

  const handleDelete = (employee) => {
    confirm({
      title: 'Xác nhận xóa nhân viên',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa nhân viên "${employee.name}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      centered: true,
      async onOk() {
        await deleteEmployee(employee.employee_id, employee.name);
      }
    });
  };

  const getFormFields = () => {
    const baseFields = modalMode === 'edit' ? EMPLOYEE_EDIT_FIELDS : EMPLOYEE_FIELDS;
    
    if (modalMode === 'add') {
      return baseFields.map(field => {
        if (field.name === 'branch_id') {
          return {
            ...field,
            options: branches,
            disabled: loadingBranches || branchError !== null,
            placeholder: loadingBranches ? 'Đang tải...' : 'Chọn chi nhánh',
            defaultValue: currentBranchId ? String(currentBranchId) : ''
          };
        }
        return field;
      });
    }
    
    return baseFields;
  };

  const handleExport = () => {
    if (filteredEmployees.length === 0) return;
    
    const headers = ['ID', 'Tên', 'Email', 'Vai trò', 'Lương', 'Chi nhánh', 'Trạng thái'];
    const rows = filteredEmployees.map(emp => [
      emp.employee_id,
      emp.name,
      emp.email,
      emp.role,
      emp.salary,
      getBranchName(emp.branch_id, branches),
      emp.status
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'employee_id',
      key: 'employee_id',
      width: 80,
      align: 'center',
      fixed: 'left',
      render: (id) => (
        <span style={{ fontWeight: '600', color: '#475569', fontSize: '14px' }}>
          {id}
        </span>
      )
    },
    {
      title: 'Nhân viên',
      key: 'employee',
      width: 220,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#FFBD71',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#5D0C0C',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            {getInitials(record.name)}
          </div>
          <div>
            <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>
              {record.name}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 250,
      render: (email) => (
        <span style={{ color: '#475569', fontSize: '13px' }}>{email}</span>
      )
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 150,
      align: 'center',
      render: (role) => (
        <Tag color={getRoleColor(role)} style={{ fontWeight: '600', fontSize: '13px' }}>
          {role}
        </Tag>
      )
    },
    {
      title: 'Lương',
      dataIndex: 'salary',
      key: 'salary',
      width: 150,
      align: 'right',
      render: (salary) => (
        <span style={{ fontWeight: '600', color: '#059669', fontSize: '14px' }}>
          {formatCurrency(salary)}
        </span>
      )
    },
    {
      title: 'Chi nhánh',
      dataIndex: 'branch_id',
      key: 'branch_id',
      width: 200,
      render: (branchId) => (
        <span style={{ color: '#64748b', fontSize: '13px' }}>
          {getBranchName(branchId, branches)}
        </span>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      align: 'center',
      render: (status) => (
        <Tag color={status === 'Đang làm việc' ? 'success' : 'default'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<FiEdit2 />}
              onClick={() => handleEditClick(record)}
              style={{ color: '#3b82f6' }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              icon={<FiTrash2 />}
              onClick={() => handleDelete(record)}
              danger
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const paginationConfig = {
    current: currentPage,
    pageSize: 10,
    total: filteredEmployees.length,
    showSizeChanger: false
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };

  return (
    <div className="employee-container">
      <div className="employee-header">
        <h1 className="employee-title">{getHeaderTitle()}</h1>
        <p className="employee-subtitle">{getHeaderSubtitle()}</p>
      </div>

      {branchError && (
        <Alert
          message="Lỗi tải dữ liệu"
          description={branchError}
          type="error"
          showIcon
          closable
          style={{ marginBottom: '16px' }}
          action={
            <Button size="small" onClick={fetchBranches}>
              Thử lại
            </Button>
          }
        />
      )}

      <div className="stats-grid">
        {STATS_CONFIG.map(stat => (
          <StatsCard
            key={stat.key}
            title={stat.title}
            value={stats[stat.key]}
            icon={stat.icon}
            color={stat.color}
            trend={null}
          />
        ))}
      </div>

      <div className="tabs-action-bar">
        <div className="role-tabs">
          {ROLE_TABS.map(tab => (
            <div
              key={tab.id}
              className={`role-tab ${activeRole === tab.id ? 'active' : ''}`}
              onClick={() => handleRoleChange(tab.id)}
            >
              {tab.label} <span className="tab-count">({roleCount(tab.id)})</span>
            </div>
          ))}
        </div>

        <div className="right-actions">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Tìm theo tên, email, ID..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <button
            className="export-btn"
            onClick={handleExport}
            disabled={filteredEmployees.length === 0 || loading}
          >
            <FiDownload />
            Export
          </button>

          <button
            className="add-btn"
            onClick={handleAddClick}
            disabled={loading || loadingBranches || branchError !== null}
          >
            <FiPlus />
            Thêm nhân viên
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        dataSource={filteredEmployees}
        loading={loading}
        pagination={paginationConfig}
        onChange={handleTableChange}
        rowKey="employee_id"
        scroll={{ x: 1400 }}
        emptyText="Không có nhân viên nào"
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveEmployee}
        title={{
          add: 'Thêm nhân viên mới',
          addDesc: 'Điền thông tin nhân viên vào form bên dưới',
          edit: 'Chỉnh sửa nhân viên',
          editDesc: 'Cập nhật thông tin nhân viên'
        }}
        icon={FiUser}
        data={selectedEmployee}
        fields={getFormFields()}
      />
    </div>
  );
};

export default Employee;