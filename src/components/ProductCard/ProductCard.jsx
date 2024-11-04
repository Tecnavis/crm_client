import { Col } from "react-bootstrap";
import "./product-card.css";
import { useNavigate } from "react-router-dom";

const ProductCard = () => {
  const router = useNavigate();
  const handelClick = () => {
    router(`/shop/:id`);
  };

  return (
    <Col md={3} sm={5} xs={10} className="product mtop">
      <img
        loading="lazy"
        onClick={() => handelClick()}
        src="https://via.placeholder.com/300x300"
        alt=""
      />
      <div className="product-like">
        <ion-icon name="heart-outline"></ion-icon>
      </div>
      <div className="product-details">
        <h3 >Bata</h3>
        <div className="rate">
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
        </div>
        <div className="price">
          <h4>$400</h4>
          <button
            aria-label="Add"
            type="submit"
            className="add"
          >
            <ion-icon name="add"></ion-icon>
          </button>
        </div>
      </div>
    </Col>
  );
};

export default ProductCard;
