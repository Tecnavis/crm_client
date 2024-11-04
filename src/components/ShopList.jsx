import { Col, Container, Row } from "react-bootstrap";
import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../src/components/ProductCard/product-card.css";
import { URL, fetchProducts, createWishlist,fetchWishlist,createCustomerCart,fetchCustomerCart } from "../components/handle_api";
import Swal from "sweetalert2";

const ShopList = () => {
  const navigate = useNavigate();

  const [allproducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts()
      .then((res) => {
        setAllProducts(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Handle product click (navigates to product page)
  const handleClick = (product) => {
    navigate(`/shop/${product._id}`, { state: { product } });
  };

 // Add product to wishlist with a duplicate check
const handleAddToWishlist = async (product) => {
  const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));
  if (!customerDetails) {
    Swal.fire({
      icon: "warning",
      title: "No Customer Info",
      text: "Please log in to add items to the wishlist.",
    });
    return;
  }
  try {
    const wishlistResponse = await fetchWishlist();
    const existingWishlist = wishlistResponse || [];
    // Check if the product is already in the wishlist
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
    // If the product is not in the wishlist, add it
    const wishlistData = {
      productId: product._id,
      customerId: customerDetails._id,
    };
    await createWishlist(wishlistData);
    Swal.fire({
      icon: "success",
      title: "Added to Wishlist",
      text: "The product has been added to your wishlist.",
    });
  } catch (error) {
    console.log("Error adding to wishlist", error);
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

  // Filter products based on the search term
  const filteredProducts = allproducts.filter((product) => {
    return (
      product.mainCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.price.toString().includes(searchTerm)
    );
  });

  return (
    <>
      <Container className="filter-bar-container">
        <Row className="justify-content-center">
          <Col md={6}>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <ion-icon name="search-outline" className="search-icon"></ion-icon>
            </div>
            <br />
          </Col>
        </Row>
      </Container>

      <Row className="justify-content-center">
        {filteredProducts.map((item) => (
          <Col key={item._id} md={3} sm={5} xs={10} className="product mtop">
            <img
              loading="lazy"
              src={`${URL}/images/${item.coverimage}`}
              alt=""
              onClick={() => handleClick(item)}
            />
            <div className="product-like">
              <ion-icon
                name="heart-outline"
                onClick={() => handleAddToWishlist(item)}  // Updated function
              ></ion-icon>
            </div>
            <div className="product-details">
              <h3>{item.mainCategory}</h3>
              <div className="rate">
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
              </div>
              <div className="price">
                <h4>${item.price}</h4>
                <button aria-label="Add" type="submit" className="add">
                  <ion-icon name="add" onClick={() => handleAddToCart(item)}></ion-icon>
                </button>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default memo(ShopList);
