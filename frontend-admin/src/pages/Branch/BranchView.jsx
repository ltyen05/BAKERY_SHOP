/* =============================================== */
/*  Location: src/pages/Branch/BranchView.jsx - FIXED */
/* =============================================== */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Space, Tag, Modal, Form, Input, Select, message, Popconfirm, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, ShopOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { mockBranches } from '../../context/mockUser';
import DataTable from '../../components/Table/Table';
import './BranchView.css';

const BranchView = () => {
  const navigate = useNavigate();
  const { viewBranch } = useAuth();
  
  const [branches, setBranches] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  useEffect(() => {
    fetchBranches();
    fetchManagers();
  }, []);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      // ✅ Transform mockBranches để có branch_id đúng
      const mockData = mockBranches.map(branch => ({
        branch_id: branch.id, // ✅ ĐÃ SỬA: Dùng id số thực
        code: branch.code,
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
        email: branch.email,
        manager_name: branch.manager,
        status: branch.status
      }));

      setBranches(mockData);
      setPagination(prev => ({ ...prev, total: mockData.length }));
    } catch (error) {
      message.error('Không thể tải dữ liệu chi nhánh');
    } finally {
      setLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const mockData = [
        { employee_id: 1, employee_name: 'Nguyễn Bảo Thạch', branch_id: 1 },
        { employee_id: 9, employee_name: 'Nguyễn Tiến Lượng', branch_id: 2 },
        { employee_id: 17, employee_name: 'Lê Thị Yến', branch_id: 3 },
        { employee_id: 25, employee_name: 'Lê Nguyễn Tố Uyên', branch_id: 4 },
        { employee_id: 33, employee_name: 'Nguyễn Văn Thu', branch_id: 5 },
        { employee_id: 41, employee_name: 'Trần Văn An', branch_id: null },
        { employee_id: 42, employee_name: 'Phạm Thị Hoa', branch_id: null }
      ];
      setManagers(mockData);
    } catch (error) {
      message.error('Không thể tải danh sách quản lý');
    }
  };

  const handleViewBranchDashboard = (record) => {
    // ✅ ĐÃ SỬA: Tìm branch theo id số thực
    const branchData = mockBranches.find(b => b.id === record.branch_id);
    
    if (branchData) {
      viewBranch({
        id: branchData.id, // ✅ Dùng id số thực
        name: branchData.name,
        code: branchData.code
      });
      
      navigate('/dashboard');
      message.success(`Đang xem chi nhánh: ${branchData.name}`);
    }
  };

  const handleAdd = () => {
    setModalType('add');
    setSelectedBranch(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setModalType('edit');
    setSelectedBranch(record);
    form.setFieldsValue({
      name: record.name,
      address: record.address,
      phone: record.phone,
      email: record.email,
      manager_id: record.manager_id,
      status: record.status
    });
    setIsModalOpen(true);
  };

  const handleView = (record) => {
    setModalType('view');
    setSelectedBranch(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (branch_id) => {
    try {
      message.success('Xóa chi nhánh thành công');
      fetchBranches();
    } catch (error) {
      message.error('Không thể xóa chi nhánh');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (modalType === 'add') {
        message.success('Thêm chi nhánh thành công');
      } else if (modalType === 'edit') {
        message.success('Cập nhật chi nhánh thành công');
      }
      
      setIsModalOpen(false);
      form.resetFields();
      fetchBranches();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  const handleTableChange = (paginationConfig) => {
    setPagination({
      current: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
      total: pagination.total
    });
  };

  const columns = [
    {
      title: 'Mã CN',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      align: 'center',
      render: (code, record) => (
        <Tooltip title="Click để xem chi nhánh này">
          <Tag 
            color="blue" 
            className="branch-id-tag clickable-tag"
            onClick={() => handleViewBranchDashboard(record)}
            style={{ cursor: 'pointer' }}
          >
            {code}
          </Tag>
        </Tooltip>
      )
    },
    {
      title: 'Tên chi nhánh',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text) => (
        <div className="branch-name">
          <ShopOutlined style={{ marginRight: 8, color: '#3b82f6' }} />
          <span>{text}</span>
        </div>
      )
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      width: 250,
      render: (text) => (
        <div className="branch-address">
          <EnvironmentOutlined style={{ marginRight: 6, color: '#ef4444' }} />
          <span>{text}</span>
        </div>
      )
    },
    {
      title: 'Liên hệ',
      key: 'contact',
      width: 180,
      render: (_, record) => (
        <div className="branch-contact">
          <div className="contact-item">
            <PhoneOutlined /> {record.phone}
          </div>
          <div className="contact-item">
            <MailOutlined /> {record.email}
          </div>
        </div>
      )
    },
    {
      title: 'Quản lý',
      dataIndex: 'manager_name',
      key: 'manager_name',
      width: 150,
      render: (text) => (
        <Tag color="green" className="manager-tag">
          {text}
        </Tag>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center',
      render: (status) => (
        <Tag color={status === 'Hoạt động' ? 'success' : 'error'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
              className="action-btn view-btn"
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              className="action-btn edit-btn"
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa chi nhánh"
              description="Bạn có chắc chắn muốn xóa chi nhánh này?"
              onConfirm={() => handleDelete(record.branch_id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
                className="action-btn delete-btn"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className="branch-view-container">
      <div className="branch-header">
        <div className="header-left">
          <h1 className="page-title">
            <ShopOutlined /> Quản lý Chi nhánh
          </h1>
          <p className="page-subtitle">
            Quản lý thông tin các chi nhánh của cửa hàng. Click vào mã chi nhánh để xem chi tiết.
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          size="large"
          className="add-btn"
        >
          Thêm chi nhánh
        </Button>
      </div>

      <DataTable
        columns={columns}
        dataSource={branches}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="branch_id"
        scroll={{ x: 1400 }}
      />

      <Modal
        title={
          modalType === 'add' 
            ? 'Thêm chi nhánh mới' 
            : modalType === 'edit' 
            ? 'Chỉnh sửa chi nhánh' 
            : 'Chi tiết chi nhánh'
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={modalType === 'view' ? [
          <Button key="close" onClick={() => setIsModalOpen(false)}>
            Đóng
          </Button>
        ] : null}
        width={700}
        className="branch-modal"
      >
        {modalType === 'view' ? (
          <div className="branch-details">
            <div className="detail-row">
              <span className="detail-label">Mã chi nhánh:</span>
              <span className="detail-value">{selectedBranch?.code}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Tên chi nhánh:</span>
              <span className="detail-value">{selectedBranch?.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Địa chỉ:</span>
              <span className="detail-value">{selectedBranch?.address}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Số điện thoại:</span>
              <span className="detail-value">{selectedBranch?.phone}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{selectedBranch?.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Quản lý:</span>
              <span className="detail-value">{selectedBranch?.manager_name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Trạng thái:</span>
              <Tag color={selectedBranch?.status === 'Hoạt động' ? 'success' : 'error'}>
                {selectedBranch?.status}
              </Tag>
            </div>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Form.Item
              label="Tên chi nhánh"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập tên chi nhánh!' }]}
            >
              <Input 
                prefix={<ShopOutlined />}
                placeholder="VD: HUS Bakery - Hoàn Kiếm" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
            >
              <Input 
                prefix={<EnvironmentOutlined />}
                placeholder="Nhập địa chỉ chi nhánh" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
              ]}
            >
              <Input 
                prefix={<PhoneOutlined />}
                placeholder="0XXXXXXXXX" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />}
                placeholder="branch@husbakery.vn" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Quản lý chi nhánh"
              name="manager_id"
              rules={[{ required: true, message: 'Vui lòng chọn quản lý!' }]}
            >
              <Select 
                placeholder="Chọn quản lý"
                size="large"
                showSearch
                optionFilterProp="children"
              >
                {managers
                  .filter(m => !m.branch_id || m.employee_id === selectedBranch?.manager_id)
                  .map(manager => (
                    <Select.Option key={manager.employee_id} value={manager.employee_id}>
                      {manager.employee_name}
                    </Select.Option>
                  ))
                }
              </Select>
            </Form.Item>

            <Form.Item
              label="Trạng thái"
              name="status"
              initialValue="Hoạt động"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            >
              <Select size="large">
                <Select.Option value="Hoạt động">Hoạt động</Select.Option>
                <Select.Option value="Tạm đóng">Tạm đóng</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item className="form-actions">
              <Space>
                <Button onClick={() => {
                  setIsModalOpen(false);
                  form.resetFields();
                }} size="large">
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" size="large">
                  {modalType === 'add' ? 'Thêm mới' : 'Cập nhật'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default BranchView;