// ===============================================
// FILE: src/api/voucherApi.js
// ✅ API khớp với backend coupon_admin_bp
// ===============================================
import api from './axiosConfig';

const BASE_PATH = '/admin/coupon_management';

export const voucherApi = {
  /**
   * Lấy danh sách voucher
   * GET /admin/coupon_management/coupon?status=Active (optional)
   */
  getAllVouchers: async (status = null) => {
    try {
      console.log('🔍 [voucherApi] Fetching vouchers...');

      const params = status ? { status } : {};
      const response = await api.get(`${BASE_PATH}/coupon`, { params });

      console.log('✅ [voucherApi] Vouchers:', response.data);

      return {
        success: true,
        data: response.data,
        count: response.data.length
      };
    } catch (error) {
      console.error('❌ [voucherApi] Error:', error);

      return {
        success: false,
        message: error.response?.data?.error || 
                 error.message || 
                 'Không thể lấy danh sách voucher',
        data: []
      };
    }
  },

  /**
   * Thêm voucher mới
   * POST /admin/coupon_management/add_coupon
   */
  addVoucher: async (voucherData) => {
    try {
      console.log('➕ [voucherApi] Adding voucher:', voucherData);

      const response = await api.post(`${BASE_PATH}/add_coupon`, voucherData);

      console.log('✅ [voucherApi] Voucher added:', response.data);

      return {
        success: true,
        message: response.data.message,
        id: response.data.id
      };
    } catch (error) {
      console.error('❌ [voucherApi] Error:', error);

      return {
        success: false,
        message: error.response?.data?.error || 
                 error.message || 
                 'Không thể thêm voucher'
      };
    }
  },

  /**
   * Cập nhật voucher
   * PUT /admin/coupon_management/update_coupon/:id
   */
  updateVoucher: async (couponId, voucherData) => {
    try {
      console.log('✏️ [voucherApi] Updating voucher:', couponId, voucherData);

      const response = await api.put(`${BASE_PATH}/update_coupon/${couponId}`, voucherData);

      console.log('✅ [voucherApi] Voucher updated:', response.data);

      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ [voucherApi] Error:', error);

      return {
        success: false,
        message: error.response?.data?.error || 
                 error.message || 
                 'Không thể cập nhật voucher'
      };
    }
  },

  /**
   * Xóa voucher
   * DELETE /admin/coupon_management/delete_coupon/:id
   */
  deleteVoucher: async (couponId) => {
    try {
      console.log('🗑️ [voucherApi] Deleting voucher:', couponId);

      const response = await api.delete(`${BASE_PATH}/delete_coupon/${couponId}`);

      console.log('✅ [voucherApi] Voucher deleted:', response.data);

      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ [voucherApi] Error:', error);

      return {
        success: false,
        message: error.response?.data?.error || 
                 error.message || 
                 'Không thể xóa voucher'
      };
    }
  }
};

export default voucherApi;
