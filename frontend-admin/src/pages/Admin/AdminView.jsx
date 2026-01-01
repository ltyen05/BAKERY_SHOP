// ===============================================
// FILE: src/pages/Admin/AdminView.jsx
// FINAL VERSION - CHỈ XEM VÀ SỬA EMAIL/LƯƠNG/TRẠNG THÁI
// ===============================================
import { useState } from "react";
import { Button, Table, Space, Tooltip, Tag } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { FiSearch, FiUser, FiMail, FiHome } from 'react-icons/fi';
import FormModal from "../../components/FormModal/FormModal";
import { useAdmin } from "./useAdmin";
import { ADMIN_FIELDS, STATUS_CONFIG, formatCurrency } from "./adminConstants";
import "./AdminView.css";

const AdminView = () => {
  const {
    admins,
    loading,
    updateAdmin,
    canManageAdmins
  } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const filteredAdmins = admins.filter(admin => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const name = admin.manager_name?.toLowerCase() || '';
    const email = admin.email?.toLowerCase() || '';
    const branch = admin.branch_name?.toLowerCase() || '';
    const id = admin.manager_id?.toString() || '';
    
    return (
      name.includes(query) ||
      email.includes(query) ||
      branch.includes(query) ||
      id.includes(query)
    );
  });

  const handleEditClick = (admin) => {
    console.log('[AdminView] Editing admin:', admin);
    setSelectedAdmin(admin);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAdmin(null);
  };

  // ✅ FIXED: Truyền branch_id vào updateAdmin
  const handleSaveAdmin = async (adminData) => {
    console.log('[AdminView] Saving admin:', {
      adminData,
      selectedAdmin
    });

    const result = await updateAdmin(
      selectedAdmin.manager_id, 
      adminData,
      selectedAdmin.branch_id  // ✅ Truyền branch_id
    );
    
    if (result?.success) {
      handleCloseModal();
    }
  };

  const renderStatus = (status) => {
    const config = STATUS_CONFIG[status] || { color: 'default' };
    return <Tag color={config.color}>{status}</Tag>;
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'manager_id',
      key: 'manager_id',
      width: 80,
      align: 'center',
      render: (id) => (
        <span className="clickable-id">
          {id}
        </span>
      )
    },
    {
      title: 'Admin',
      key: 'admin',
      width: 250,
      render: (_, record) => (
        <div className="admin-info">
          <div className="admin-icon">
            <FiUser />
          </div>
          <div>
            <div className="admin-name-text">{record.manager_name}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              {record.role || 'Admin'}
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
        <div className="contact-item-text">
          <FiMail />
          <span>{email}</span>
        </div>
      )
    },
    {
      title: 'Chi nhánh',
      dataIndex: 'branch_name',
      key: 'branch',
      width: 280,
      render: (branchName) => {
        if (!branchName) {
          return (
            <span style={{ 
              color: '#cbd5e1', 
              fontSize: '13px',
              fontStyle: 'italic'
            }}>
              Chưa quản lý chi nhánh
            </span>
          );
        }
        
        return (
          <div className="branch-info-text">
            <FiHome style={{ marginRight: 6, color: '#FFBD71' }} />
            <span>{branchName}</span>
          </div>
        );
      }
    },
    {
      title: 'Lương',
      dataIndex: 'salary',
      key: 'salary',
      width: 150,
      align: 'right',
      render: (salary) => {
        if (!salary) {
          return <span style={{ color: '#94a3b8', fontSize: '13px' }}>Chưa xác định</span>;
        }
        
        return (
          <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '13px' }}>
            {formatCurrency(salary)}
          </span>
        );
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      align: 'center',
      render: (status) => renderStatus(status || 'Đang làm việc')
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          {canManageAdmins() && (
            <Tooltip title="Chỉnh sửa">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleEditClick(record)}
                style={{ color: '#3b82f6' }}
              />
            </Tooltip>
          )}
          {/* ❌ BỎ NÚT XÓA - Admin chỉ có thể xóa từ trang Branch */}
        </Space>
      )
    }
  ];

  return (
    <div className="admin-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Danh sách Admin</h1>
          <p className="admin-page-subtitle">
            Xem và chỉnh sửa thông tin admin ({admins.length} admin)
          </p>
          <div style={{ 
            marginTop: '12px',
            padding: '12px 16px',
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#0369a1',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '16px' }}>💡</span>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                Hướng dẫn quản lý Admin:
              </div>
              <div>
                • Thêm/Xóa admin: Vào trang <strong>"Chi nhánh"</strong> → Chọn/bỏ chọn quản lý
              </div>
              <div>
                • Chỉnh sửa: Email, Lương, Trạng thái (tại trang này)
              </div>
            </div>
          </div>
        </div>

        <div className="admin-header-actions">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Tìm theo tên, email, chi nhánh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredAdmins}
        loading={loading}
        rowKey="manager_id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} admin`,
          position: ['bottomCenter'],
          pageSizeOptions: ['10', '20', '50']
        }}
        scroll={{ 
          x: 1400
        }}
      />

      {/* ✅ MODAL CHỈ CHO CHỈNH SỬA */}
      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveAdmin}
        title={{
          edit: 'Chỉnh sửa thông tin Admin',
          editDesc: 'Chỉ có thể sửa: Email, Lương, Trạng thái'
        }}
        icon={FiUser}
        data={selectedAdmin}
        fields={ADMIN_FIELDS}
      />
    </div>
  );
};

export default AdminView;