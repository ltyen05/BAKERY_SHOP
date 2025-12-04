import "./productCard.css";
import starIcon from "../../assets/Star.svg";
import { Button } from "antd";

function Product({ productName, price, image }) {
  return (
    <div className="box">
      <div className="list">
        <img src={image} alt={productName} className="img-course" />
        <div className="info">
          <div className="info-head mb-3">
            <div style={{ width: "70%", textAlign: "left" }}>
              <h3 className="h3-level">{productName}</h3>
            </div>
            <div className="rating">
              <img src={starIcon} alt="star" />
              <span>4.5</span>
            </div>
          </div>
          <div className="info-foot">
            <span className="price">
              <span style={{ fontSize: "16px" }}>{price}</span>đ
            </span>

            <Button className="btn btn-second">Thêm vào giỏ</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Product;
