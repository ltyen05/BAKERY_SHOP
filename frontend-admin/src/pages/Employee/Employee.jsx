import React from "react";
import "./Employee.css";

const staffList = [
  {
    id: 3,
    name: "John Doe",
    email: "admin@demo.com",
    avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&crop=faces",
    permissions: ["super_admin", "customer", "store_owner"],
    wallet: "-",
    status: "Active",
  },
  {
    id: 2,
    name: "Customer",
    email: "customer@demo.com",
    avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=200&crop=faces",
    permissions: ["customer"],
    wallet: "1090",
    status: "Active",
  },
  {
    id: 1,
    name: "Store Owner",
    email: "store_owner@demo.com",
    avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&h=200&crop=faces",
    permissions: ["customer", "store_owner"],
    wallet: "-",
    status: "Active",
  },
];

export default function Staff() {
  return (
    <div className="staff-container">
      <h2>Staff Management</h2>

      <table className="staff-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Permissions</th>
            <th>Available wallet points</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {staffList.map((staff) => (
            <tr key={staff.id}>
              <td>#ID: {staff.id}</td>

              <td className="staff-user-column">
                <img className="avatar" src={staff.avatar} alt="avatar" />
                <div>
                  <div className="name">{staff.name}</div>
                  <div className="email">{staff.email}</div>
                </div>
              </td>

              <td>
                <div className="permissions">
                  {staff.permissions.map((p, index) => (
                    <span key={index} className="permission-tag">
                      {p}
                    </span>
                  ))}
                </div>
              </td>

              <td>{staff.wallet}</td>

              <td>
                <span className="status-active">Active</span>
              </td>

              <td className="action-buttons">
                <button className="btn-icon">👤</button>
                <button className="btn-icon">👑</button>
                <button className="btn-icon red">🚫</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* SIMPLE PAGINATION */}
      <div className="pagination">
        <button>{"<"}</button>
        <span className="page-number active">1</span>
        <button>{">"}</button>
      </div>
    </div>
  );
}
