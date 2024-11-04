import { Col, Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { fetchProducts, URL ,createWishlist,fetchWishlist, createCustomerCart, fetchCustomerCart} from "../components/handle_api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Section = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      const latestProducts = data.reverse().slice(0, 3);
      setProducts(latestProducts);
    };

    getProducts();
  }, []);

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
          <h1>Best Sales</h1>
        </div>
        <Row className="justify-content-center">
          {products.map((item) => (
            <Col key={item.id} md={3} sm={5} xs={10} className="product mtop">
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
      </Container>
    </section>
  );
};

export default Section;
