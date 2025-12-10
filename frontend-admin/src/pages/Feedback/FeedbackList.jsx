import React, { useState } from "react";
import "./Feedback.css";
import { DatePicker } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { BsCheckCircleFill, BsStarFill } from "react-icons/bs";
import { HiDotsVertical } from "react-icons/hi";
import "antd/dist/antd.css";

const initialReviews = [
  {
    id: 85,
    product: "Milan The Story of Love",
    customer: "Customer2",
    review: "Book is good but had to wait for long.",
    rating: 3,
    likes: 0,
    dislikes: 0,
    date: "4 years ago",
    image:
      "https://i.pinimg.com/736x/90/63/bd/9063bd40e8d342bc28c5afa32dfe35e8.jpg",
  },
  {
    id: 84,
    product: "Space Forces First Chapter",
    customer: "Customer2",
    review: "For me it's the book of the year.",
    rating: 5,
    likes: 0,
    dislikes: 0,
    date: "4 years ago",
    image:
      "https://i.pinimg.com/736x/a7/26/44/a7264465e610e155c18b0d1a5a53e4ed.jpg",
  },
  {
    id: 83,
    product: "Space Forces Second Chapter",
    customer: "Customer2",
    review: "Too much fiction all over.",
    rating: 1,
    likes: 0,
    dislikes: 0,
    date: "4 years ago",
    image:
      "https://i.pinimg.com/736x/1b/7e/06/1b7e0654bd250f1245658e2d28fd3a11.jpg",
  },
];

export default function Feedback() {
  const [activeTab, setActiveTab] = useState("All");
  const [reviews, setReviews] = useState(initialReviews);
  const [search, setSearch] = useState("");

  const filtered = reviews.filter((item) =>
    item.product.toLowerCase().includes(search.toLowerCase())
  );

  const sortAZ = () =>
    setReviews([...reviews].sort((a, b) => a.product.localeCompare(b.product)));
  const sortZA = () =>
    setReviews([...reviews].sort((a, b) => b.product.localeCompare(a.product)));

  return (
    <div className="feedback-page">

      {/*SEARCH + SORT */}
      <div className="top-search-area">
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <div className="sort-dropdown">
          <button className="sort-main-btn">Sort ▼</button>
          <div className="sort-menu">
            <button onClick={sortAZ}>A → Z</button>
            <button onClick={sortZA}>Z → A</button>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="review-title red-background">
        <h3>Recent Review</h3>
        <p>Here is customer review about your restaurant</p>
        <button className="latest-btn">Latest ▼</button>
      </div>

      {/* Tabs + Date */}
      <div className="review-header">

        {/* TABS */}
        <div className="tabs">
          {["All", "Published", "Deleted"].map((tab) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* DATE */}
        <div className="filter">
          <label>Filter Date</label>
          <div className="date-range">
            <CalendarOutlined style={{ color: "#ff5e91" }} />
            <DatePicker format="DD MMM YYYY" />
          </div>
        </div>

      </div>

      {/* Reviews table */}
      <h2>Customer Reviews</h2>

      <table className="review-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Review</th>
            <th>Rating</th>
            <th>Likes</th>
            <th>Date</th>
            <th style={{ textAlign: "center" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((item) => (
            <tr key={item.id} className="review-row">

              <td className="col-id">#{item.id}</td>

              <td className="product-cell">
                <img src={item.image} alt="" className="prod-img" />
                <div>
                  <p className="prod-name">{item.product}</p>
                </div>
              </td>

              <td className="review-cell">
                <p className="customer">
                  By <strong>{item.customer}</strong>
                  <BsCheckCircleFill className="verified-icon" />
                </p>
                <p className="review-text">{item.review}</p>
              </td>

              <td className="rating-cell">
                <div className="rating-badge">
                  {item.rating}
                  <BsStarFill className="star-icon" />
                </div>
              </td>

              <td className="likes-cell">
                <AiOutlineLike /> <span>{item.likes}</span>
                <AiOutlineDislike style={{ marginLeft: 14 }} />{" "}
                <span>{item.dislikes}</span>
              </td>

              <td className="date-cell">{item.date}</td>

              <td className="action-cell">
                <button className="action-btn">
                  <HiDotsVertical size={22} />
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button>{"<"}</button>
        <span className="page-number active">1</span>
        <button>{">"}</button>
      </div>
    </div>
  );
}
