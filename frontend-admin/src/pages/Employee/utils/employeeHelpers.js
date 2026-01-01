// ===============================================
// Location: src/pages/Employee/utils/employeeHelpers.js
// ===============================================
import { getBranchName } from '../employeeConstants';

export const exportEmployeesToCSV = (employees, branches) => {
  if (employees.length === 0) return;
  
  const headers = ['ID', 'Tên', 'Email', 'Vai trò', 'Lương', 'Chi nhánh', 'Trạng thái'];
  const rows = employees.map(emp => [
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