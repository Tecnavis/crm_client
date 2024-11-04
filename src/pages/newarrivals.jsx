import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCustomerCart, createWishlist, fetchCustomerCart, fetchProducts, fetchWishlist, URL } from "../components/handle_api";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Swal from "sweetalert2";

const Section = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
    });
  }, []);

  const handleClick = (product) => {
    navigate(`/shop/${product._id}`, { state: { product } });
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4, 
      slidesToSlide: 1, 
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2, 
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1, 
      slidesToSlide: 1,
    },
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
          <h1>New Arrivals</h1>
        </div>
        <Carousel responsive={responsive}>
          {products.map((item) => (
            <div key={item._id} className="product mtop">
              <span className="discount">New</span>
              <img
                loading="lazy"
                src={`${URL}/images/${item.coverimage}`}
                alt=""
                onClick={() => handleClick(item)}
              />
              <div className="product-like">
                <ion-icon name="heart-outline" onClick={() => handleAddToWishlist(item)}></ion-icon>
              </div>
              <div className="product-details">
                <h3>{item.subCategory}</h3>
                <div className="rate">
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                </div>
                <div className="price">
                  <h4>{item.price}</h4>
                  <button aria-label="Add" type="submit" className="add">
                    <ion-icon name="add" onClick={() => handleAddToCart(item)}></ion-icon>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </Container>
    </section>
  );
};

export default Section;
