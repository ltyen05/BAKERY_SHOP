
import "./productCard.css";
import starIcon from "../../assets/Star.svg";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

function Product({
  product_id,
  product_name,
  price,
  image,
  rating,
  onAddToCart,
  isAddingToCart, // ⭐ Thêm prop
}) {
  const navigate = useNavigate();

  const handleGoDetail = () => {
    navigate(`/productDetails/${product_id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();

    onAddToCart?.({
      product_id,
      product_name,
      image,
      price,
    });
  };

  return (
    <div className="box" onClick={handleGoDetail} style={{ cursor: "pointer" }}>
      <div className="list">
        <img src={image} alt={product_name} className="img-course" />

        <div className="info">
          <div className="info-head mb-3">
            <div style={{ width: "70%", textAlign: "left" }}>
              <h3 className="h3-level">{product_name}</h3>
            </div>
            <div className="rating">
              <img src={starIcon} alt="star" />
              <span>{rating}</span>
            </div>
          </div>

          <div className="info-foot">
            <span className="price">
              <span style={{ fontSize: "16px" }}>
                {price.toLocaleString("vi-VN")}
              </span>
              đ
            </span>

            <Button
              className="btn btn-second"
              onClick={handleAddToCart}
              disabled={isAddingToCart} // ⭐ Disable khi đang thêm
            >
              Thêm vào giỏ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
