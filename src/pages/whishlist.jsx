import React, { useEffect, useState } from "react";
import "./style.css"; // Import the CSS file
import { fetchWishlist, URL ,deleteWishlist, createCustomerCart, fetchCustomerCart} from "../components/handle_api";
import Swal from "sweetalert2";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    fetchWishlist()
      .then((res) => {
        setWishlistItems(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
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
    <div className="wishlist-container">
      <h1>My Wishlist</h1>
      <table className="wishlist-table">
        <thead>
          <tr>
            <th></th>
            <th>Product Name</th>
            <th>Unit Price</th>
            <th>Color</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {wishlistItems.map((item) => (
            <tr key={item._id}>
              <td className="remove">
                <button onClick={() => deleteWishlist(item._id)}>×</button>
              </td>
              <td className="product-info">
                <img
                  src={`${URL}/images/${item.productId.coverimage}`}
                  alt={item.productId.mainCategory}
                  className="product-image"
                />
                <span>{item.productId.mainCategory}<br/>{item.productId.subCategory}</span>
              </td>
              <td className="price">
                <span className="current-price">{item.productId.price}</span>
              </td>
              <td className="color">
                <span>{item.productId.color}</span>
              </td>
              <td>
                <button className="add-to-cart-btn" onClick={() => handleAddToCart(item.productId)}>Add to Cart</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Wishlist;
