import { useState } from "react";
import { Button, Table, Space, Tooltip } from "antd";
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EnvironmentOutlined 
} from "@ant-design/icons";
import { FiMapPin, FiPhone, FiMail, FiHome, FiSearch } from 'react-icons/fi';
import FormModal from "../../components/FormModal/FormModal";
import { useBranch } from "./useBranch";
import { BRANCH_FIELDS } from "./branchConstants";
import "./BranchView.css";

const BranchView = () => {
  const {
    branches,
    loading,
    handleViewBranch,
    addBranch,
    updateBranch,
    deleteBranch,
    canManageBranches
  } = useBranch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBranches = branches.filter(branch => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const name = branch.name?.toLowerCase() || '';
    const address = branch.address?.toLowerCase() || '';
    const phone = branch.phone?.toLowerCase() || '';
    const email = branch.email?.toLowerCase() || '';
    const manager = branch.manager_name?.toLowerCase() || '';
    const id = branch.branch_id?.toString() || '';
    
    return (
      name.includes(query) ||
      address.includes(query) ||
      phone.includes(query) ||
      email.includes(query) ||
      manager.includes(query) ||
      id.includes(query)
    );
  });

  const handleAddClick = () => {
    setModalMode('add');
    setSelectedBranch(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (branch) => {
    setModalMode('edit');
    setSelectedBranch(branch);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (branch) => {
    await deleteBranch(branch.branch_id, branch.name);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBranch(null);
  };

  const handleSaveBranch = async (branchData) => {
    let result;
    
    if (modalMode === 'edit') {
      result = await updateBranch(selectedBranch.branch_id, branchData);
    } else {
      result = await addBranch(branchData);
    }
    
    if (result?.success) {
      handleCloseModal();
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'branch_id',
      key: 'branch_id',
      width: 80,
      align: 'center',
      fixed: 'left',
      render: (id, record) => (
        <span 
          onClick={() => handleViewBranch(record)}
          className="clickable-id"
        >
          {id}
        </span>
      )
    },
    {
      title: 'Chi nhánh',
      key: 'branch',
      width: 250,
      render: (_, record) => (
        <div className="branch-info">
          <div className="branch-icon">
            <FiHome />
          </div>
          <div>
            <div className="branch-name-text">{record.name}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Quản lý',
      dataIndex: 'manager_name',
      key: 'manager',
      width: 180,
      render: (managerName, record) => {
        if (!record.manager_id || !managerName) {
          return (
            <span style={{ 
              color: '#cbd5e1', 
              fontSize: '13px',
              fontStyle: 'italic'
            }}>
              Chưa có quản lý
            </span>
          );
        }

        return (
          <div>
            <div style={{ 
              fontWeight: 600, 
              color: '#1e293b',
              fontSize: '14px',
              marginBottom: '4px'
            }}>
              {managerName}
            </div>
            {record.manager_role && (
              <div style={{ 
                fontSize: '12px', 
                color: '#64748b'
              }}>
                {record.manager_role}
              </div>
            )}
          </div>
        );
      }
    },
    {
      title: 'Email quản lý',
      dataIndex: 'manager_email',
      key: 'manager_email',
      width: 220,
      render: (email) => {
        if (!email) {
          return (
            <span style={{ 
              color: '#cbd5e1', 
              fontSize: '13px',
              fontStyle: 'italic'
            }}>
              Chưa có email
            </span>
          );
        }

        return (
          <span style={{ 
            color: '#475569',
            fontSize: '13px'
          }}>
            {email}
          </span>
        );
      }
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      width: 300,
      render: (address) => (
        <div className="branch-address-text">
          <FiMapPin style={{ marginRight: 6, color: '#3b82f6' }} />
          {address}
        </div>
      )
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: 140,
      render: (phone) => (
        <div className="contact-item-text">
          <FiPhone />
          <span>{phone}</span>
        </div>
      )
    },
    {
      title: 'Email chi nhánh',
      dataIndex: 'email',
      key: 'email',
      width: 220,
      render: (email) => (
        <div className="contact-item-text">
          <FiMail />
          <span>{email}</span>
        </div>
      )
    },
    {
      title: 'Bản đồ',
      key: 'map',
      width: 300,
      render: (_, record) => {
        if (!record.mapSrc) {
          return (
            <div style={{ 
              textAlign: 'center',
              padding: '12px',
              background: '#f8fafc',
              borderRadius: '8px',
              color: '#94a3b8',
              fontSize: '12px'
            }}>
              <EnvironmentOutlined style={{ fontSize: '16px', marginBottom: '4px' }} />
              <div>Chưa có bản đồ</div>
            </div>
          );
        }

        return (
          <div style={{ 
            width: '100%',
            height: '120px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #e2e8f0'
          }}>
            <iframe
              src={record.mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map of ${record.name}`}
            />
          </div>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          {canManageBranches() && (
            <>
              <Tooltip title="Chỉnh sửa">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => handleEditClick(record)}
                  style={{ color: '#3b82f6' }}
                />
              </Tooltip>
              <Tooltip title="Xóa">
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteClick(record)}
                  danger
                />
              </Tooltip>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="branch-container">
      <div className="branch-page-header">
        <div>
          <h1 className="branch-page-title">Quản lý Chi nhánh</h1>
          <p className="branch-page-subtitle">
            Quản lý thông tin các chi nhánh của hệ thống
          </p>
        </div>

        <div className="branch-header-actions">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Tìm theo tên, địa chỉ, SĐT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {canManageBranches() && (
            <button className="branch-add-btn" onClick={handleAddClick}>
              <PlusOutlined />
              Thêm chi nhánh
            </button>
          )}
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredBranches}
        loading={loading}
        rowKey="branch_id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} chi nhánh`,
          position: ['bottomCenter'],
          pageSizeOptions: ['10', '20', '50']
        }}
        scroll={{ 
          x: 2000
        }}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveBranch}
        title={{
          add: 'Thêm chi nhánh mới',
          addDesc: 'Điền thông tin chi nhánh vào form bên dưới',
          edit: 'Chỉnh sửa chi nhánh',
          editDesc: 'Cập nhật thông tin chi nhánh'
        }}
        icon={FiHome}
        data={selectedBranch}
        fields={BRANCH_FIELDS}
      />
    </div>
  );
};

export default BranchView;