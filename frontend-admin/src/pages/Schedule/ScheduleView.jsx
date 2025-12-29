import { useState } from 'react';
import './ScheduleView.css';

export default function ScheduleView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week'); // week | month
  const [selectedShift, setSelectedShift] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Mock data nhân viên
  const employees = [
    { id: 1, name: 'Nguyễn Văn A', role: 'CSKH', avatar: '👨' },
    { id: 2, name: 'Trần Thị B', role: 'Tiếp tân', avatar: '👩' },
    { id: 3, name: 'Lê Văn C', role: 'Đầu bếp', avatar: '👨‍🍳' },
    { id: 4, name: 'Phạm Thu D', role: 'CSKH', avatar: '👩' },
    { id: 5, name: 'Hoàng Minh E', role: 'Tiếp tân', avatar: '👨' },
  ];

  // Mock data ca làm việc
  const shifts = {
    morning: { name: 'Sáng', time: '6:00 - 14:00', color: '#3b82f6' },
    afternoon: { name: 'Chiều', time: '14:00 - 22:00', color: '#f59e0b' },
    night: { name: 'Tối', time: '22:00 - 6:00', color: '#8b5cf6' },
  };

  // Mock schedule data
  const scheduleData = {
    '2025-12-23': [
      { employeeId: 1, shift: 'morning' },
      { employeeId: 2, shift: 'afternoon' },
      { employeeId: 3, shift: 'morning' },
    ],
    '2025-12-24': [
      { employeeId: 1, shift: 'afternoon' },
      { employeeId: 4, shift: 'morning' },
      { employeeId: 5, shift: 'night' },
    ],
    '2025-12-25': [
      { employeeId: 2, shift: 'morning' },
      { employeeId: 3, shift: 'afternoon' },
      { employeeId: 4, shift: 'afternoon' },
    ],
    '2025-12-26': [
      { employeeId: 1, shift: 'morning' },
      { employeeId: 2, shift: 'morning' },
      { employeeId: 5, shift: 'afternoon' },
    ],
    '2025-12-27': [
      { employeeId: 3, shift: 'morning' },
      { employeeId: 4, shift: 'night' },
    ],
  };

  // Get current week dates
  const getWeekDates = (date) => {
    const curr = new Date(date);
    const first = curr.getDate() - curr.getDay() + 1; // Monday
    const dates = [];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(curr.setDate(first + i));
      dates.push(day);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentDate);

  // Format date
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDayName = (date) => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[date.getDay()];
  };

  // Navigation
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get schedule for date
  const getScheduleForDate = (date) => {
    const dateStr = formatDate(date);
    return scheduleData[dateStr] || [];
  };

  // Get employee by id
  const getEmployee = (id) => {
    return employees.find(emp => emp.id === id);
  };

  // Stats
  const getTotalShifts = () => {
    let total = 0;
    weekDates.forEach(date => {
      const dateStr = formatDate(date);
      total += (scheduleData[dateStr] || []).length;
    });
    return total;
  };

  const getEmployeeWorkingDays = () => {
    const workingDays = {};
    employees.forEach(emp => {
      workingDays[emp.id] = 0;
    });
    
    weekDates.forEach(date => {
      const dateStr = formatDate(date);
      const daySchedule = scheduleData[dateStr] || [];
      daySchedule.forEach(schedule => {
        workingDays[schedule.employeeId]++;
      });
    });
    
    return workingDays;
  };

  const workingDays = getEmployeeWorkingDays();

  return (
    <div className="schedule-container">
      {/* Header */}
      <div className="schedule-header">
        <div>
          <h1 className="schedule-title">Lịch làm việc</h1>
          <p className="schedule-subtitle">Quản lý ca làm việc của nhân viên</p>
        </div>
        <button className="btn-add-schedule" onClick={() => setIsAddModalOpen(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14m7-7H5"/>
          </svg>
          Thêm ca làm
        </button>
      </div>

      {/* Stats */}
      <div className="schedule-stats">
        <div className="stat-card">
          <div className="stat-icon stat-blue">📅</div>
          <div>
            <p className="stat-label">Tổng ca tuần này</p>
            <h3 className="stat-value">{getTotalShifts()}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-green">👥</div>
          <div>
            <p className="stat-label">Nhân viên hoạt động</p>
            <h3 className="stat-value">{Object.values(workingDays).filter(d => d > 0).length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-amber">⏰</div>
          <div>
            <p className="stat-label">Ca sáng</p>
            <h3 className="stat-value">
              {Object.values(scheduleData).flat().filter(s => s.shift === 'morning').length}
            </h3>
          </div>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="calendar-controls">
        <div className="calendar-nav">
          <button className="nav-btn" onClick={goToPreviousWeek}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button className="today-btn" onClick={goToToday}>Hôm nay</button>
          <button className="nav-btn" onClick={goToNextWeek}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
          <h2 className="current-month">
            Tháng {currentDate.getMonth() + 1}, {currentDate.getFullYear()}
          </h2>
        </div>

        <div className="view-toggle">
          <button 
            className={`toggle-btn ${view === 'week' ? 'active' : ''}`}
            onClick={() => setView('week')}
          >
            Tuần
          </button>
          <button 
            className={`toggle-btn ${view === 'month' ? 'active' : ''}`}
            onClick={() => setView('month')}
          >
            Tháng
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="shift-legend">
        <span className="legend-title">Ca làm việc:</span>
        {Object.entries(shifts).map(([key, shift]) => (
          <div key={key} className="legend-item">
            <div className="legend-dot" style={{ background: shift.color }}></div>
            <span>{shift.name} ({shift.time})</span>
          </div>
        ))}
      </div>

      {/* Schedule Table */}
      <div className="schedule-table-container">
        <table className="schedule-table">
          <thead>
            <tr>
              <th className="employee-col">Nhân viên</th>
              {weekDates.map((date, index) => {
                const isToday = formatDate(date) === formatDate(new Date());
                return (
                  <th key={index} className={`date-col ${isToday ? 'today' : ''}`}>
                    <div className="date-header">
                      <span className="day-name">{formatDayName(date)}</span>
                      <span className="day-number">{date.getDate()}</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.id}>
                <td className="employee-cell">
                  <div className="employee-info">
                    <div className="employee-avatar">{employee.avatar}</div>
                    <div>
                      <div className="employee-name">{employee.name}</div>
                      <div className="employee-role">{employee.role}</div>
                    </div>
                  </div>
                </td>
                {weekDates.map((date, index) => {
                  const dateStr = formatDate(date);
                  const daySchedule = getScheduleForDate(date);
                  const employeeShift = daySchedule.find(s => s.employeeId === employee.id);
                  const isToday = dateStr === formatDate(new Date());

                  return (
                    <td key={index} className={`shift-cell ${isToday ? 'today' : ''}`}>
                      {employeeShift ? (
                        <div 
                          className="shift-badge"
                          style={{ background: shifts[employeeShift.shift].color }}
                          onClick={() => setSelectedShift({ employee, date, shift: employeeShift.shift })}
                        >
                          <div className="shift-name">{shifts[employeeShift.shift].name}</div>
                          <div className="shift-time">{shifts[employeeShift.shift].time}</div>
                        </div>
                      ) : (
                        <button 
                          className="add-shift-btn"
                          onClick={() => setSelectedShift({ employee, date, shift: null })}
                        >
                          +
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Employee Summary */}
      <div className="employee-summary">
        <h3>Tổng kết tuần</h3>
        <div className="summary-list">
          {employees.map(employee => (
            <div key={employee.id} className="summary-item">
              <div className="summary-employee">
                <span className="summary-avatar">{employee.avatar}</span>
                <span className="summary-name">{employee.name}</span>
              </div>
              <div className="summary-stats">
                <span className="summary-days">{workingDays[employee.id]} ngày</span>
                <div className="summary-progress">
                  <div 
                    className="summary-progress-bar"
                    style={{ width: `${(workingDays[employee.id] / 7) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}