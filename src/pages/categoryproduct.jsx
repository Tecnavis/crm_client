import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../../src/components/ProductCard/product-card.css";
import { URL, createCustomerCart, createWishlist, fetchCustomerCart, fetchProductsbyCategory, fetchWishlist } from "../components/handle_api";
import Swal from "sweetalert2";

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const navigate = useNavigate();
  useEffect(() => {
    if (category) {
      const getProducts = async () => {
        try {
          const data = await fetchProductsbyCategory(category);
          setProducts(data);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };
      getProducts();
    }
  }, [category]);
  const handleClick = (product) => {
    navigate(`/shop/${product._id}`, { state: { product } });
  };

  // Add product to wishlist with a duplicate check
  const handleAddToWishlist = async (product) => {
    const customerDetails = JSON.parse(
      localStorage.getItem("customerDetails")
    );

    if (!customerDetails) {
      Swal.fire({
        icon: "warning",
        title: "No Customer Info",
        text: "Please log in to add items to the wishlist.",
      });
      return;
    }

    try {
      const wishlistResponse = await fetchWishlist(customerDetails._id);
      const existingWishlist = wishlistResponse || [];

      const isProductInWishlist = existingWishlist.some(
        (item) => item.productId._id === product._id
      );

      if (isProductInWishlist) {
        Swal.fire({
          icon: "info",
          title: "Already in Wishlist",
          text: "This product is already in your wishlist.",
        });
        return;
      }

      const wishlistData = {
        productId: product._id,
        customerId: customerDetails._id,
      };

      const response = await createWishlist(wishlistData);

      Swal.fire({
        icon: "success",
        title: "Added to Wishlist",
        text: "The product has been added to your wishlist.",
      });
    } catch (error) {
      console.log("Error adding to wishlist", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong, please try again later.",
      });
    }
  };

   // Add product to addcart with a duplicate check
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
    <section style={{ background: "#f5f5f5" }}>
      <Container>
        <div className="heading">
          <h1>Products in {category}</h1>
        </div>
        {products.length === 0 ? (
          <p>No products found for this category.</p>
        ) : (
          <Row className="justify-content-center">
            {products.map((product) => (
              <Col
                key={product._id}
                md={3}
                sm={5}
                xs={10}
                className="product mtop"
              >
                <img
                  loading="lazy"
                  src={`${URL}/images/${product.coverimage}`}
                  alt={product.subCategory}
                  onClick={() => handleClick(product)}
                />
                <div className="product-like">
                  <ion-icon name="heart-outline" onClick={() => handleAddToWishlist(product)}></ion-icon>
                </div>
                <div className="product-details">
                  <h3>{product.subCategory}</h3>
                  <div className="rate">
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                  </div>
                  <div className="price">
                    <h4>${product.price}</h4>
                    <button aria-label="Add" type="submit" className="add">
                      <ion-icon name="add" onClick={() => handleAddToCart(product)}></ion-icon>
                    </button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </section>
  );
};

export default ProductSection;
