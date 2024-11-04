import { useState } from "react";
import { Container } from "react-bootstrap";
import "./product-review.css";
import { useLocation } from "react-router-dom";

const ProductReviews = () => {
  const [listSelected, setListSelected] = useState("desc");
  const location = useLocation();
  const { product } = location.state || {}; 
  return (
    <section className="product-reviews">
      <Container>
        <ul>
          <li
            style={{ color: listSelected === "desc" ? "black" : "#9c9b9b" }}
            onClick={() => setListSelected("desc")}
          >
            Description
          </li>
          <li
            style={{ color: listSelected === "rev" ? "black" : "#9c9b9b" }}
            onClick={() => setListSelected("rev")}
          >
            Reviews (2)
          </li>
        </ul>
        {listSelected === "desc" ? (
          <p>
           {product.description}
          </p>
        ) : (
          <div className="rates">
            <div className="rate-comment">
              <span>Jhon Doe</span>
              <span>4.5 (rating)</span>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
};

export default ProductReviews;
