import { useState } from "react";
import { Carousel, Col, Container, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "./product-details.css";
import { createCustomerCart, fetchCustomerCart, URL } from "../handle_api";
import Swal from "sweetalert2";

const ProductDetails = () => {
  const location = useLocation();
  const { product } = location.state || {}; 

  // Set the initially selected image as the cover image
  const [selectedImage, setSelectedImage] = useState(product?.coverimage);

  if (!product) {
    return <p>No product details available</p>;
  }

  // Helper to group images into sets of 3
  const groupImages = (images, size) => {
    const grouped = [];
    for (let i = 0; i < images.length; i += size) {
      grouped.push(images.slice(i, i + size));
    }
    return grouped;
  };

  const groupedImages = groupImages(product.images || [], 3);
  //add cart
  const handleAddToCart = async (product) => {
    const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));
    if (!customerDetails) {
      Swal.fire({
        icon: "warning",
        title: "No Customer Info",
        text: "Please log in to add items to the cart.",
      });
      return;
    }
    try {
      const cartResponse = await fetchCustomerCart();
      const existingCart = cartResponse || [];
      // Check if the product is already in the cart
      const isProductInCart = existingCart.some(
        (item) => item.productId._id === product._id
      );
      if (isProductInCart) {
        Swal.fire({
          icon: "info",
          title: "Already in Cart",
          text: "This product is already in your cart.",
        });
        return;
      }
      // If the product is not in the cart, add it
      const cartData = {
        productId: product._id,
        customerId: customerDetails._id,
      };
      await createCustomerCart(cartData);
      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: "The product has been added to your cart.",
      });
    } catch (error) {
      console.log("Error adding to cart", error);
    }
  };
  return (
    <section className="product-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <img
              loading="lazy"
              src={`${URL}/images/${selectedImage}`} 
              alt={product.mainCategory}
              className="main-product-image"
            />
          </Col>
          <Col md={6}>
            <h2>{product.mainCategory}</h2>
            <div className="rate">
              <div className="stars">
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
              </div>
              <span>4.5 ratings</span>
            </div>
            <div className="info">
              <span className="price">{product.price}</span>
              <span>Category: {product.subCategory}</span>
            </div>

            <br />
            <hr />
            <h5>{product.title}</h5>
            <p>{product.description}</p>
            {/* Available Sizes */}
            <span>Available Sizes:</span><br />
            <div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
              {product.sizes.map((size) => (
                <button
                  key={size._id}
                  style={{
                    marginRight: "10px",
                    width: "50px",
                    height: "40px",
                    borderRadius: "10%",
                    border: "1px solid #ccc",
                    backgroundColor:  "peru" ,
                    color: "#fff" ,
                    cursor: "pointer",
                  }}
                >
                  {size.size}
                </button>
              ))}
            </div>

            {/* Add to Cart */}
          
            <div className="div1" style={{ display: "flex", marginTop: "20px" }}>
              <input
                className="qty-input"
                type="number"
                placeholder="Qty"
                defaultValue="1"
                min="1"
              />
              <button aria-label="Add" type="submit" className="add" onClick={() => handleAddToCart(product)}>
                Add To Cart
              </button>
            </div>
         
          </Col>
        </Row>

        {/* Other Images */}
        <Row className="mt-4">
          <Col md={6}>
            <Carousel
              indicators={false}
              interval={null}
              className="product-image-carousel"
            >
              {groupedImages.map((group, index) => (
                <Carousel.Item key={index}>
                  <Row>
                    {group.map((image, imgIndex) => (
                      <Col key={imgIndex} md={4}>
                        <img
                          className={`d-block w-100 thumbnail ${
                            selectedImage === image ? "active" : ""
                          }`}
                          src={`${URL}/images/${image}`}
                          alt={`Product Thumbnail ${index * 3 + imgIndex + 1}`}
                          onClick={() => setSelectedImage(image)}
                        />
                      </Col>
                    ))}
                  </Row>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ProductDetails;
