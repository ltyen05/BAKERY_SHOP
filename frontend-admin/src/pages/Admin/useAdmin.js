// ===============================================
// FILE: src/pages/Admin/useAdmin.js
// FIXED: Truyền branch_id vào updateAdmin
// ===============================================
import { useState, useEffect } from 'react';
import { message, Modal } from 'antd';
import { adminApi } from '../../api/adminApi';
import { branchApi } from '../../api/branchApi';
import { useAuth } from '../../context/AuthContext';

export const useAdmin = () => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const canManageAdmins = () => {
    return user?.role === 'super_admin';
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      console.log('[useAdmin] Fetching admins...');

      const branchResult = await branchApi.getAllBranches();
      
      if (!branchResult.success) {
        message.error('Không thể tải danh sách chi nhánh');
        setAdmins([]);
        return;
      }

      const branchIds = branchResult.data.map(b => b.branch_id);
      console.log('[useAdmin] Branch IDs:', branchIds);

      const result = await adminApi.getAllAdmins(branchIds);

      if (result.success) {
        console.log('[useAdmin] Admins loaded:', result.data.length);
        setAdmins(result.data);
      } else {
        console.error('[useAdmin] Failed:', result.message);
        message.error(result.message || 'Không thể tải danh sách admin');
        setAdmins([]);
      }
    } catch (error) {
      console.error('[useAdmin] Fetch error:', error);
      message.error('Đã xảy ra lỗi khi tải dữ liệu');
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Truyền branch_id vào API
  const updateAdmin = async (adminId, adminData, currentBranchId) => {
    try {
      console.log('[useAdmin] Updating admin:', {
        adminId,
        adminData,
        currentBranchId
      });

      const result = await adminApi.updateAdmin(adminId, adminData, currentBranchId);

      if (result.success) {
        message.success(result.message || 'Cập nhật admin thành công');
        await fetchAdmins();
        return { success: true };
      } else {
        message.error(result.message || 'Không thể cập nhật admin');
        return { success: false };
      }
    } catch (error) {
      console.error('[useAdmin] Update error:', error);
      message.error('Đã xảy ra lỗi khi cập nhật admin');
      return { success: false };
    }
  };

  const deleteAdmin = async (adminId, adminName) => {
    return new Promise((resolve) => {
      Modal.confirm({
        title: 'Xác nhận xóa admin',
        content: `Bạn có chắc chắn muốn xóa admin "${adminName}"? \n\nHành động này không thể hoàn tác!`,
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        centered: true,
        onOk: async () => {
          try {
            console.log('[useAdmin] Deleting admin:', adminId);

            const result = await adminApi.deleteAdmin(adminId);

            if (result.success) {
              message.success(result.message || 'Xóa admin thành công');
              await fetchAdmins();
              resolve({ success: true });
            } else {
              message.error(result.message || 'Không thể xóa admin');
              resolve({ success: false });
            }
          } catch (error) {
            console.error('[useAdmin] Delete error:', error);
            message.error('Đã xảy ra lỗi khi xóa admin');
            resolve({ success: false });
          }
        },
        onCancel: () => {
          resolve({ success: false });
        }
      });
    });
  };

  return {
    admins,
    loading,
    
    updateAdmin,
    deleteAdmin,
    
    canManageAdmins
  };
};