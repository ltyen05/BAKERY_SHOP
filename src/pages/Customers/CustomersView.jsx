import React, { useState } from "react";
import "./CustomersView.css";

const initialCustomers = [
  {
    id: "#4015323",
    joinDate: "02 Sep 2024, 06:24 AM",
    name: "Veronica",
    location: "Corner Street 5th London",
    totalSpent: "$164.52",
    lastOrder: "$14.89",
    status: "Active",
  },
  {
    id: "#4015375",
    joinDate: "03 Sep 2024, 07:24 AM",
    name: "Emilia Johanson",
    location: "21 King Street London",
    totalSpent: "$74.92",
    lastOrder: "$8.13",
    status: "Inactive",
  },
  {
    id: "#4015311",
    joinDate: "04 Sep 2024, 08:24 AM",
    name: "Olivia Shine",
    location: "67 St. John’s Road London",
    totalSpent: "$251.16",
    lastOrder: "$21.55",
    status: "Active",
  },
  // Các khách hàng khác...
];

export default function CustomersView() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === customers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(customers.map((c) => c.id));
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Customers</h2>
      <table className="customer-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedIds.length === customers.length}
                onChange={toggleSelectAll}
              />
            </th>
            <th>Customer ID</th>
            <th>Join Date</th>
            <th>Customer Name</th>
            <th>Location</th>
            <th>Total Spent</th>
            <th>Last Order</th>
            <th>Status</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(customer.id)}
                  onChange={() => toggleSelect(customer.id)}
                />
              </td>
              <td>{customer.id}</td>
              <td>{customer.joinDate}</td>
              <td>{customer.name}</td>
              <td>{customer.location}</td>
              <td>{customer.totalSpent}</td>
              <td>
                <span className="last-order-badge">{customer.lastOrder}</span>
              </td>
              <td>
                <span
                  className={
                    customer.status === "Active"
                      ? "status-active"
                      : "status-inactive"
                  }
                >
                  {customer.status}
                </span>
              </td>
              <td className="edit-cell">...</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
