// ===============================================
// FILE: src/pages/Branch/useBranch.js
// Custom Hook for Branch Management - FIXED (No JSX)
// ===============================================
import { useState, useEffect } from 'react';
import { message, Modal } from 'antd';
import { branchApi } from '../../api/branchApi';
import { useAuth } from '../../context/AuthContext';

export const useBranch = () => {
  // AUTH CONTEXT
  const { viewBranch, canManageBranches } = useAuth();

  // STATE
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH DATA
  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      console.log('Fetching branches...');

      const result = await branchApi.getAllBranches();

      if (result.success) {
        console.log('Branches loaded:', result.data.length);
        console.log('Sample data:', result.data[0]);
        
        setBranches(result.data);
        message.success(`Đã tải ${result.count} chi nhánh`);
      } else {
        console.error('Failed:', result.message);
        message.error(result.message || 'Không thể tải danh sách chi nhánh');
        setBranches([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      message.error('Đã xảy ra lỗi khi tải dữ liệu');
      setBranches([]);
    } finally {
      setLoading(false);
    }
  };

  // VIEW BRANCH (Click vào ID)
  const handleViewBranch = async (branch) => {
    try {
      console.log('Viewing branch:', branch.branch_id);

      const branchData = {
        id: branch.branch_id,
        name: branch.name,
        address: branch.address,
        manager: branch.manager_name || 'Chưa có'
      };

      viewBranch(branchData);
      message.success(`Đang xem chi nhánh: ${branch.name}`);
    } catch (error) {
      console.error('View error:', error);
      message.error('Không thể xem chi nhánh');
    }
  };

  // ADD BRANCH
  const addBranch = async (branchData) => {
    try {
      console.log('Adding branch:', branchData);

      const result = await branchApi.addBranch(branchData);

      if (result.success) {
        message.success(result.message || 'Thêm chi nhánh thành công');
        await fetchBranches();
        return { success: true };
      } else {
        message.error(result.message || 'Không thể thêm chi nhánh');
        return { success: false };
      }
    } catch (error) {
      console.error('Add error:', error);
      message.error('Đã xảy ra lỗi khi thêm chi nhánh');
      return { success: false };
    }
  };

  // UPDATE BRANCH
  const updateBranch = async (branchId, branchData) => {
    try {
      console.log('Updating branch:', branchId, branchData);

      const result = await branchApi.updateBranch(branchId, branchData);

      if (result.success) {
        message.success(result.message || 'Cập nhật chi nhánh thành công');
        await fetchBranches();
        return { success: true };
      } else {
        message.error(result.message || 'Không thể cập nhật chi nhánh');
        return { success: false };
      }
    } catch (error) {
      console.error('Update error:', error);
      message.error('Đã xảy ra lỗi khi cập nhật chi nhánh');
      return { success: false };
    }
  };

  // DELETE BRANCH
  const deleteBranch = async (branchId, branchName) => {
    return new Promise((resolve) => {
      Modal.confirm({
        title: 'Xác nhận xóa chi nhánh',
        content: `Bạn có chắc chắn muốn xóa chi nhánh "${branchName}"? \n\nHành động này không thể hoàn tác!`,
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        centered: true,
        onOk: async () => {
          try {
            console.log('Deleting branch:', branchId);

            const result = await branchApi.deleteBranch(branchId);

            if (result.success) {
              message.success(result.message || 'Xóa chi nhánh thành công');
              await fetchBranches();
              resolve({ success: true });
            } else {
              message.error(result.message || 'Không thể xóa chi nhánh');
              resolve({ success: false });
            }
          } catch (error) {
            console.error('Delete error:', error);
            message.error('Đã xảy ra lỗi khi xóa chi nhánh');
            resolve({ success: false });
          }
        },
        onCancel: () => {
          resolve({ success: false });
        }
      });
    });
  };

  // RETURN
  return {
    branches,
    loading,
    
    handleViewBranch,
    addBranch,
    updateBranch,
    deleteBranch,
    
    canManageBranches
  };
};