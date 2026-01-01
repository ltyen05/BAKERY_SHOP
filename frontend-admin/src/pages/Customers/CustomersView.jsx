// ===============================================
// src/pages/Customers/CustomersView.jsx
// ===============================================
import React, { useState, useEffect, useMemo } from 'react';
import { Tag, Space, Button, Modal, message } from 'antd';
import {
  FiEdit2, FiTrash2, FiDownload, FiSearch, FiPlus,
  FiUsers, FiMail, FiPhone, FiUser
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
    required: true
  },
  {
    name: 'phone',
    label: 'Số điện thoại',
    type: 'input',
    inputType: 'tel',
    icon: FiPhone,
    required: true
  },
  {
    name: 'email',
    label: 'Email',
    type: 'input',
    inputType: 'email',
    icon: FiMail,
    required: true,
    fullWidth: true
  },
  {
    name: 'password',
    label: 'Mật khẩu',
    type: 'input',
    inputType: 'password',
    icon: FiUser,
    required: false,
    fullWidth: true,
    helperText: 'Bắt buộc khi thêm mới, bỏ trống khi chỉnh sửa'
  }
];

export default function CustomersView() {
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
        message.error(result.message || 'Không thể tải khách hàng');
        setCustomers([]);
        return;
      }

      const rawData = result.data?.data || result.data || [];
      const customerArray = Array.isArray(rawData) ? rawData : [];

      const mapped = customerArray.map(c => {
        const rank = c.rank
          ? c.rank.charAt(0).toUpperCase() + c.rank.slice(1).toLowerCase()
          : 'Bronze';

        return {
          id: c.id || c.customer_id,
          key: c.id || c.customer_id,
          customerId: `KH${String(c.id || c.customer_id).padStart(3, '0')}`,
          name: c.name || 'N/A',
          email: c.email || 'N/A',
          phone: c.phone || 'N/A',
          total_amount: c.total_amount || 0,
          rank
        };
      });

      setCustomers(mapped);
    } catch (err) {
      console.error(err);
      message.error('Lỗi tải khách hàng');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    return customers.filter(c => {
      const tab = RANK_TABS.find(t => t.id === activeRank);
      const matchRank = !tab?.rank || c.rank === tab.rank;

      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.customerId.toLowerCase().includes(q);

      return matchRank && matchSearch;
    });
  }, [customers, activeRank, searchQuery]);

  const handleAddCustomer = async (data) => {
    if (!data.password) {
      message.error('Mật khẩu bắt buộc khi thêm mới');
      return;
    }
    await customerApi.addCustomer(data);
    await fetchCustomers();
    setIsAddModalOpen(false);
  };

  const handleUpdateCustomer = async (id, data) => {
    await customerApi.updateCustomer(id, data);
    await fetchCustomers();
    setIsEditModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleDelete = (record) => {
    confirm({
      title: 'Xóa khách hàng?',
      icon: <ExclamationCircleOutlined />,
      content: record.name,
      okType: 'danger',
      onOk: async () => {
        await customerApi.deleteCustomer(record.id);
        await fetchCustomers();
      }
    });
  };

  const columns = [
    {
      title: 'Mã KH',
      dataIndex: 'customerId',
      align: 'center',
      width: 100,
      fixed: 'left',
      render: text => <Tag color="blue">{text}</Tag>
    },
    { title: 'Họ và tên', dataIndex: 'name', width: 200 },
    { title: 'SĐT', dataIndex: 'phone', align: 'center', width: 130 },
    { title: 'Email', dataIndex: 'email', width: 220 },
    {
      title: 'Tổng chi tiêu',
      dataIndex: 'total_amount',
      align: 'center',
      width: 150,
      render: v => `${v.toLocaleString('vi-VN')} ₫`
    },
    {
      title: 'Hạng',
      dataIndex: 'rank',
      align: 'center',
      width: 120,
      render: r => <Tag>{r}</Tag>
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 100,
      render: (_, r) => (
        <Space>
          <Button icon={<FiEdit2 />} onClick={() => { setSelectedCustomer(r); setIsEditModalOpen(true); }} />
          <Button icon={<FiTrash2 />} danger onClick={() => handleDelete(r)} />
        </Space>
      )
    }
  ];

  return (
    <div className="customer-container">
      <DataTable
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: rowsPerPage,
          total: filteredData.length,
          onChange: setCurrentPage
        }}
        rowKey="id"
      />

      <FormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCustomer}
        fields={customerFields}
        mode="add"
      />

      <FormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateCustomer}
        data={selectedCustomer}
        fields={customerFields}
        mode="edit"
      />
    </div>
  );
}
