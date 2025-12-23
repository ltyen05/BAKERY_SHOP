import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa"; // import icon từ react-icons
import "./OrdersView.css";

const OrdersView = () => {
  const [statusFilter, setStatusFilter] = useState("ALL");

  const orders = [
    { id: "#4546563", date: "26 March 2020, 12:42 AM", customer: "Roberto Carlo", location: "Roberto Carlo", amount: "$34.41", status: "New Order" },
    { id: "#5552351", date: "26 March 2020, 12:42 AM", customer: "James Wltcwicky", location: "Corner Street 5th London", amount: "$164.52", status: "New Order" },
    { id: "#5552351", date: "26 March 2020, 12:42 AM", customer: "Emilia Johanson", location: "67 St. John's Road London", amount: "$251.16", status: "On Delivery" },
    { id: "#5552351", date: "26 March 2020, 12:42 AM", customer: "Jessica Wong", location: "11 Church Road London", amount: "$24.17", status: "New Order" },
    { id: "#5552351", date: "26 March 2020, 12:42 AM", customer: "Olivia Shine", location: "35 Station Road London", amount: "$82.46", status: "Delivered" },
  ];

  const filteredOrders =
    statusFilter === "ALL"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  return (
    <div className="order-container">
      <div className="header-row">
        <div>
          <h2>Orders</h2>
          <p className="subtitle">Here is your order list data</p>
        </div>
        <div className="filter-box">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All Status</option>
            <option value="New Order">New Order</option>
            <option value="On Delivery">On Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      <table className="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Customer Name</th>
            <th>Location</th>
            <th>Amount</th>
            <th>Status Order</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order, index) => (
            <tr key={index}>
              <td>{order.id}</td>
              <td>{order.date}</td>
              <td>{order.customer}</td>
              <td>{order.location}</td>
              <td>{order.amount}</td>
              <td>
                <span className={`badge ${order.status.replace(" ", "-").toLowerCase()}`}>
                  {order.status}
                </span>
              </td>
              <td className="edit-icons">
                <FaEdit className="icon edit" />
                <FaTrash className="icon delete" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersView;
