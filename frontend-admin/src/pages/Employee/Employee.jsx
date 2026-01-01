// ===============================================
// Location: src/pages/Employee/Employee.jsx
// ===============================================
import React, { useState } from 'react';
import { Modal, Alert, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useEmployee } from './useEmployee';
import { useBranches } from './hooks/useBranches';
import EmployeeHeader from './components/EmployeeHeader';
import EmployeeStats from './components/EmployeeStats';
import EmployeeActionBar from './components/EmployeeActionBar';
import EmployeeTable from './components/EmployeeTable';
import EmployeeModal from './components/EmployeeModal';
import { exportEmployeesToCSV } from './utils/employeeHelpers';
import './Employee.css';

const { confirm } = Modal;

const Employee = () => {
  // HOOKS
  const {
    filteredEmployees,
    stats,
    loading,
    activeRole,
    searchQuery,
    currentPage,
    currentBranchId,
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

  const { branches, loading: loadingBranches, error: branchError, refetch } = useBranches();

  // LOCAL STATE
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // HANDLERS - ADD
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

  // HANDLERS - EDIT
  const handleEditClick = (employee) => {
    setModalMode('edit');
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  // HANDLERS - CLOSE MODAL
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  // HANDLERS - SAVE
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

  // HANDLERS - DELETE
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

  // HANDLERS - EXPORT
  const handleExport = () => {
    exportEmployeesToCSV(filteredEmployees, branches);
  };

  // PAGINATION CONFIG
  const paginationConfig = {
    current: currentPage,
    pageSize: 10,
    total: filteredEmployees.length,
    showSizeChanger: false
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };

  // RENDER
  return (
    <div className="employee-container">
      {/* Header */}
      <EmployeeHeader 
        title={getHeaderTitle()} 
        subtitle={getHeaderSubtitle()} 
      />

      {/* Error Alert */}
      {branchError && (
        <Alert
          message="Lỗi tải dữ liệu"
          description={branchError}
          type="error"
          showIcon
          closable
          style={{ marginBottom: '16px' }}
          action={
            <Button size="small" onClick={refetch}>
              Thử lại
            </Button>
          }
        />
      )}

      {/* Stats */}
      <EmployeeStats stats={stats} />

      {/* Action Bar */}
      <EmployeeActionBar
        activeRole={activeRole}
        searchQuery={searchQuery}
        roleCount={roleCount}
        employees={filteredEmployees}
        loading={loading}
        loadingBranches={loadingBranches}
        branchError={branchError}
        onRoleChange={handleRoleChange}
        onSearchChange={handleSearchChange}
        onExport={handleExport}
        onAdd={handleAddClick}
      />

      {/* Table */}
      <EmployeeTable
        employees={filteredEmployees}
        loading={loading}
        branches={branches}
        pagination={paginationConfig}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        onPageChange={handleTableChange}
      />

      {/* Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        mode={modalMode}
        selectedEmployee={selectedEmployee}
        branches={branches}
        loadingBranches={loadingBranches}
        branchError={branchError}
        currentBranchId={currentBranchId}
        onClose={handleCloseModal}
        onSubmit={handleSaveEmployee}
      />
    </div>
  );
};

export default Employee;