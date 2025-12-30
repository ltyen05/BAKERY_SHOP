// ===============================================
// src/pages/Customers/CustomersView.jsx 
// ===============================================
import React, { useState, useEffect, useMemo } from 'react';
import { Tag, Space, Button, Modal, message } from 'antd';
import { 
  FiEdit2, FiTrash2, FiDownload, FiSearch, FiPlus, 
  FiUsers, FiAward, FiMail, FiPhone, FiUser
} from 'react-icons/fi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { customerApi } from '../../api/customerApi';
import DataTable from '../../components/Table/Table';
import FormModal from '../../components/FormModal/FormModal';
import './CustomersView.css';

const { confirm } = Modal;

const RANK_TABS = [
  { id: 'all', label: 'Tất cả', rank: null },
  { id: 'bronze', label: 'Bronze', rank: 'Bronze' },
  { id: 'silver', label: 'Silver', rank: 'Silver' },
  { id: 'gold', label: 'Gold', rank: 'Gold' },
  { id: 'platinum', label: 'Platinum', rank: 'Platinum' }
];

const customerFields = [
  {
    name: 'name',
    label: 'Họ và tên',
    type: 'input',
    inputType: 'text',
    icon: FiUser,
    placeholder: 'Nguyễn Văn A',
    required: true
  },
  {
    name: 'phone',
    label: 'Số điện thoại',
    type: 'input',
    inputType: 'tel',
    icon: FiPhone,
    placeholder: '0901234567',
    required: true
  },
  {
    name: 'email',
    label: 'Email',
    type: 'input',
    inputType: 'email',
    icon: FiMail,
    placeholder: 'customer@email.com',
    required: true,
    fullWidth: true
  },
  {
    name: 'password',
    label: 'Mật khẩu',
    type: 'input',
    inputType: 'password',
    icon: FiUser,
    placeholder: 'Nhập mật khẩu',
    required: true,
    fullWidth: true,
    helperText: 'Bắt buộc khi thêm mới, tùy chọn khi chỉnh sửa (để reset mật khẩu)'
  }
];

export default function Customer() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRank, setActiveRank] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const rowsPerPage = 10;

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const result = await customerApi.getAllCustomers();
      
      if (!result.success) {
        message.error(result.message || 'Không thể tải dữ liệu khách hàng');
        setCustomers([]);
        return;
      }
      
      const customerArray = Array.isArray(result.data) ? result.data : [];
      
      const mappedCustomers = customerArray.map(c => {
        const rank = c.rank 
          ? c.rank.charAt(0).toUpperCase() + c.rank.slice(1).toLowerCase()
          : 'Bronze';
        
        return {
          key: c.id || c.customer_id,
          id: c.id || c.customer_id,
          customerId: `KH${String(c.id || c.customer_id).padStart(3, '0')}`,
          name: c.name || 'N/A',
          email: c.email || 'N/A',
          phone: c.phone || 'N/A',
          total_amount: c.total_amount || 0,
          rank: rank
        };
      });
      
      setCustomers(mappedCustomers);
      message.success(`Tải ${mappedCustomers.length} khách hàng thành công!`);
    } catch (error) {
      console.error('Error fetching customers:', error);
      message.error('Không thể tải dữ liệu khách hàng');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // Stats
  const stats = useMemo(() => {
    const total = customers.length;
    const bronze = customers.filter(c => c.rank === 'Bronze').length;
    const silver = customers.filter(c => c.rank === 'Silver').length;
    const gold = customers.filter(c => c.rank === 'Gold').length;
    const platinum = customers.filter(c => c.rank === 'Platinum').length;
    return { total, bronze, silver, gold, platinum };
  }, [customers]);

  const handleAddCustomer = async (data) => {
    try {
      if (!data.password || !data.password.trim()) {
        message.error('Mật khẩu không được để trống khi thêm khách hàng mới');
        throw new Error('Password required');
      }
      
      const result = await customerApi.addCustomer(data);
      
      if (!result.success) {
        message.error(result.message || 'Không thể thêm khách hàng');
        throw new Error(result.message);
      }
      
      await fetchCustomers();
      setIsAddModalOpen(false);
      message.success('Thêm khách hàng thành công!');
    } catch (err) {
      console.error('Error adding customer:', err);
      throw err;
    }
  };

  const handleUpdateCustomer = async (customerId, data) => {
    try {
      const updateData = { ...data };
      // Chỉ gửi password nếu có thay đổi
      if (!updateData.password || !updateData.password.trim()) {
        delete updateData.password;
      }
      
      const result = await customerApi.updateCustomer(customerId, updateData);
      
      if (!result.success) {
        message.error(result.message || 'Không thể cập nhật khách hàng');
        throw new Error(result.message);
      }
      
      await fetchCustomers();
      setIsEditModalOpen(false);
      setSelectedCustomer(null);
      message.success('Cập nhật khách hàng thành công!');
    } catch (err) {
      console.error('Error updating customer:', err);
      throw err;
    }
  };

  const handleDelete = (customer) => {
    confirm({
      title: 'Xác nhận xóa khách hàng',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc muốn xóa khách hàng "${customer.name}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      centered: true,
      async onOk() {
        try {
          const result = await customerApi.deleteCustomer(customer.id);
          
          if (!result.success) {
            message.error(result.message || 'Không thể xóa khách hàng');
            return;
          }
          
          await fetchCustomers();
          message.success('Xóa khách hàng thành công!');
        } catch (err) {
          console.error('Error deleting customer:', err);
          message.error('Không thể xóa khách hàng');
        }
      }
    });
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Mã KH', 'Họ và tên', 'Email', 'Số điện thoại', 'Tổng chi tiêu', 'Hạng'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(c => 
        [c.id, c.customerId, c.name, c.email, c.phone, c.total_amount, c.rank].join(',')
      )
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    message.success('Xuất file CSV thành công!');
  };

  const filteredData = useMemo(() => {
    return customers.filter(customer => {
      const currentTab = RANK_TABS.find(t => t.id === activeRank);
      const matchRank = !currentTab?.rank || customer.rank === currentTab.rank;
      
      const query = searchQuery.toLowerCase().trim();
      const matchSearch = query === '' ||
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.includes(query) ||
        customer.customerId.toLowerCase().includes(query);
      
      return matchRank && matchSearch;
    });
  }, [customers, activeRank, searchQuery]);

  const rankCount = (rankId) => {
    const tab = RANK_TABS.find(t => t.id === rankId);
    if (!tab?.rank) return customers.length;
    return customers.filter(c => c.rank === tab.rank).length;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const columns = [
    {
      title: 'Mã KH',
      dataIndex: 'customerId',
      key: 'customerId',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: (text) => (
        <Tag color="blue" style={{ fontWeight: 700, fontSize: '12px', fontFamily: 'monospace' }}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: 600
          }}>
            {getInitials(text)}
          </div>
          <span style={{ fontWeight: 600, color: '#1e293b' }}>{text}</span>
        </div>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
      align: 'center',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 220,
      ellipsis: true,
    },
    {
      title: 'Tổng chi tiêu',
      dataIndex: 'total_amount',
      key: 'total_amount',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.total_amount - b.total_amount,
      render: (amount) => (
        <span style={{ fontWeight: 700, color: '#10b981', fontSize: '14px' }}>
          {formatCurrency(amount)}
        </span>
      ),
    },
    {
      title: 'Hạng',
      dataIndex: 'rank',
      key: 'rank',
      width: 120,
      align: 'center',
      render: (rank) => {
        const colorMap = {
          'Bronze': { color: '#92400e', bg: '#fef3c7', border: '#fde68a' },
          'Silver': { color: '#475569', bg: '#f1f5f9', border: '#cbd5e1' },
          'Gold': { color: '#b45309', bg: '#fef3c7', border: '#fcd34d' },
          'Platinum': { color: '#4338ca', bg: '#e0e7ff', border: '#c7d2fe' }
        };
        const style = colorMap[rank] || colorMap['Bronze'];
        
        return (
          <Tag 
            style={{ 
              color: style.color,
              background: style.bg,
              border: `1px solid ${style.border}`,
              fontWeight: 600,
              fontSize: '12px',
              borderRadius: '999px',
              padding: '4px 12px'
            }}
          >
            {rank}
          </Tag>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<FiEdit2 style={{ color: '#3b82f6' }} />}
            onClick={() => {
              setSelectedCustomer(record);
              setIsEditModalOpen(true);
            }}
            title="Chỉnh sửa"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
          <Button
            type="text"
            icon={<FiTrash2 style={{ color: '#ef4444' }} />}
            onClick={() => handleDelete(record)}
            title="Xóa"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
        </Space>
      ),
    },
  ];

  const paginationConfig = {
    current: currentPage,
    pageSize: rowsPerPage,
    total: filteredData.length,
    onChange: (page) => setCurrentPage(page),
    showSizeChanger: false,
  };

  return (
    <div className="customer-container">
      {/* Header */}
      <div className="customer-header">
        <h2 className="customer-title">Customer Management</h2>
        <p className="customer-subtitle">Quản lý thông tin khách hàng</p>
      </div>

      {/* Tabs + Actions */}
      <div className="tabs-action-bar">
        <div className="rank-tabs">
          {RANK_TABS.map(tab => (
            <div
              key={tab.id}
              onClick={() => { 
                setActiveRank(tab.id); 
                setCurrentPage(1); 
              }}
              className={`rank-tab ${activeRank === tab.id ? 'active' : ''}`}
            >
              {tab.label} <span className="tab-count">({rankCount(tab.id)})</span>
            </div>
          ))}
        </div>
        
        <div className="right-actions">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm theo tên, email, SĐT..."
              value={searchQuery}
              onChange={(e) => { 
                setSearchQuery(e.target.value); 
                setCurrentPage(1); 
              }}
              className="search-input"
            />
          </div>

          <button onClick={handleExportCSV} className="export-btn">
            <FiDownload /> Export
          </button>

          <button onClick={() => setIsAddModalOpen(true)} className="add-customer-btn">
            <FiPlus /> Thêm khách hàng
          </button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={paginationConfig}
        rowKey="id"
        scroll={{ x: 1200 }}
        emptyText="Không tìm thấy khách hàng nào"
      />

      {/* Add Modal */}
      <FormModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCustomer}
        title={{ 
          add: 'Thêm khách hàng mới',
          addDesc: 'Điền thông tin khách hàng mới'
        }}
        icon={FiUsers}
        fields={customerFields}
        mode="add"
      />

      {/* Edit Modal */}
      <FormModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCustomer(null);
        }}
        onSubmit={handleUpdateCustomer}
        data={selectedCustomer}
        title={{ 
          edit: 'Chỉnh sửa khách hàng',
          editDesc: 'Cập nhật thông tin khách hàng (hạng tự động cập nhật theo tổng chi tiêu)'
        }}
        icon={FiUsers}
        fields={customerFields}
        mode="edit"
      />
    </div>
  );
}