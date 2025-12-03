import React, { useState } from "react";
import "./OrdersView.css";

const OrdersView = () => {
  const [filter, setFilter] = useState("ALL");

  const orders = [
    {
      id: "#5552323",
      date: "02 Oct 2024 06:24 AM",
      customer: "Veronica",
      location: "Corner Street 5th London",
      amount: "$164.52",
      status: "PENDING",
    },
    {
      id: "#5552375",
      date: "03 Oct 2024 07:24 AM",
      customer: "Emilia Johanson",
      location: "21 King Street London",
      amount: "$74.92",
      status: "CANCELED",
    },
    {
      id: "#5552311",
      date: "04 Oct 2024 08:24 AM",
      customer: "Olivia Shine",
      location: "67 St. John's Road London",
      amount: "$251.16",
      status: "DELIVERED",
    },
    {
      id: "#5552388",
      date: "05 Oct 2024 09:24 AM",
      customer: "Jessica Wong",
      location: "35 Station Road London",
      amount: "$82.46",
      status: "PENDING",
    },
    {
      id: "#5552358",
      date: "06 Oct 2024 10:24 AM",
      customer: "David Horison",
      location: "11 Church Road",
      amount: "$24.17",
      status: "CANCELED",
    },
    {
      id: "#5552322",
      date: "07 Oct 2024 11:24 AM",
      customer: "Samantha Bake",
      location: "981 St. John's Road London",
      amount: "$24.55",
      status: "PENDING",
    },
    {
      id: "#5552397",
      date: "08 Oct 2024 12:20 PM",
      customer: "Franky Sihotang",
      location: "79 The Drive London",
      amount: "$22.18",
      status: "DELIVERED",
    },
  ];

  const filteredOrders =
    filter === "ALL"
      ? orders
      : orders.filter((o) => o.status === filter);

  return (
    <div className="order-container">
      <div className="header-row">
        <h2>Orders</h2>

        {/* Bộ lọc */}
        <div className="filter-box">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELED">Canceled</option>
          </select>
        </div>
      </div>

      <table className="order-table">
        <thead>
          <tr>
            <th>ORDER ID</th>
            <th>DATE</th>
            <th>CUSTOMER NAME</th>
            <th>LOCATION</th>
            <th>AMOUNT</th>
            <th>STATUS ORDER</th>
            <th>EDIT</th>
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
                <span className={`badge ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </td>
              <td className="dots">⋮</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersView;