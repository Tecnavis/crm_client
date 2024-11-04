import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import {
  URL,
  fetchCustomerCart,
  deleteCustomerCart,
} from "../components/handle_api";
import "./style.css";
import Placeorder from "./placeorder";
import Swal from "sweetalert2";

const Cart = () => {
  const [customerCart, setCustomerCart] = useState([]);
  const [isCheckoutAvailable, setIsCheckoutAvailable] = useState(false);

  useEffect(() => {
    fetchCustomerCart().then((data) => {
      const updatedCart = data.map((item) => ({
        ...item,
        productId: {
          ...item.productId,
          sizes: item.productId.sizes.map((size) => ({
            ...size,
            quantity: 1,
          })),
        },
      }));
      setCustomerCart(updatedCart);
    });
    // Check if checkoutDetails is in localStorage
    const checkoutDetails = localStorage.getItem("checkoutDetails");
    setIsCheckoutAvailable(!!checkoutDetails);
  }, []);

  // Function to calculate total price
  const calculateTotalPrice = () => {
    return customerCart.reduce((total, item) => {
      const itemTotal = item.productId.sizes.reduce((sizeTotal, size) => {
        return sizeTotal + size.quantity * item.productId.price;
      }, 0);
      return total + itemTotal;
    }, 0);
  };

  // Function to calculate total quantity of purchased items
  const calculateTotalQuantity = () => {
    return customerCart.reduce((total, item) => {
      const itemTotalQuantity = item.productId.sizes.reduce(
        (sizeTotal, size) => {
          return sizeTotal + size.quantity;
        },
        0
      );
      return total + itemTotalQuantity;
    }, 0);
  };

  // Function to update quantity
  const updateQuantity = (itemId, sizeId, delta) => {
    setCustomerCart((prevCart) =>
      prevCart.map((item) => {
        if (item._id === itemId) {
          return {
            ...item,
            productId: {
              ...item.productId,
              sizes: item.productId.sizes.map((size) => {
                if (size._id === sizeId) {
                  return {
                    ...size,
                    quantity: Math.max(size.quantity + delta, 0),
                  }; // Prevent negative quantity
                }
                return size;
              }),
            },
          };
        }
        return item;
      })
    );
  };

  // Function to handle checkout
  const handleCheckout = () => {
    const totalQuantity = calculateTotalQuantity();

    if (totalQuantity === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Cart is empty",
      });
      return;
    }

    const selectedProducts = customerCart.flatMap((item) =>
      item.productId.sizes
        .filter((size) => size.quantity > 0)
        .map((size) => ({
          productDetails: {
            id: item.productId._id,
            color: item.productId.color,
            title: item.productId.title,
            mainCategory: item.productId.mainCategory,
            subCategory: item.productId.subCategory,
            price: item.productId.price,
            coverImage: item.productId.coverimage,
          },
          sizeDetails: {
            sizeId: size._id,
            size: size.size,
            quantity: size.quantity,
            totalAmount: size.quantity * item.productId.price,
          },
        }))
    );
    Swal.fire({
      icon: "success",
      title: "Checkout Successful",
      text: "Your order has been placed successfully.",
    });
    window.location.reload();

    const totalAmount = calculateTotalPrice();

    // Store in local storage
    localStorage.setItem(
      "checkoutDetails",
      JSON.stringify({
        selectedProducts,
        totalAmount,
        totalQuantity,
      })
    );
    setIsCheckoutAvailable(true);
  };

  const totalQuantity = calculateTotalQuantity();

  return (
    <section
      className={`cart-items ${totalQuantity > 0 ? "disabled-page" : ""}`}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            {customerCart.map((item) => (
              <div className="cart-list" key={item._id}>
                <Row className="align-items-center">
                  <Col className="image-holder" sm={4} md={3}>
                    <img
                      src={`${URL}/images/${item.productId.coverimage}`}
                      alt={item.productId.title}
                      className="product-image"
                    />
                  </Col>
                  <Col sm={8} md={9}>
                    <Row className="cart-content justify-content-between align-items-center">
                      <Col xs={12} sm={9} className="cart-details">
                        <h3>{item.productId.mainCategory}</h3>
                        <p className="sub-category">
                          {item.productId.subCategory}
                        </p>
                        <div className="sizes">
                          <strong>Available Sizes:</strong>
                          <div className="size-list">
                            {item.productId.sizes.map((sizeItem) => (
                              <div className="size-item" key={sizeItem._id}>
                                <span>Size: {sizeItem.size}</span>
                                <span className="quantity">
                                  Quantity: {sizeItem.quantity}
                                </span>
                                <div className="size-controls">
                                  <button
                                    className="incCart"
                                    onClick={() =>
                                      updateQuantity(item._id, sizeItem._id, 1)
                                    }
                                  >
                                    <i className="fa-solid fa-plus"></i>
                                  </button>
                                  <button
                                    className="desCart"
                                    onClick={() =>
                                      updateQuantity(item._id, sizeItem._id, -1)
                                    }
                                  >
                                    <i className="fa-solid fa-minus"></i>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <h4 className="price">
                          Total: ${calculateTotalPrice().toFixed(2)}
                        </h4>
                      </Col>
                      <Col xs={12} sm={3} className="cartControl text-end">
                        <button className="delete">
                          <ion-icon
                            name="close"
                            onClick={() => deleteCustomerCart(item._id)}
                          ></ion-icon>
                        </button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            ))}
          </Col>

          <Col md={4} style={{ height: "100%" }}>
            <div className="cart-total">
              <h2>Cart Summary ({customerCart.length})</h2>
              <div className="d-flex justify-content-between">
                <h4>Purchased Items :</h4>
                <h3>{calculateTotalQuantity()}</h3>{" "}
                {/* Show total quantity here */}
              </div>
              <div className="d-flex justify-content-between">
                <h4>Total Price :</h4>
                <h3>${calculateTotalPrice().toFixed(2)}</h3>
              </div>

              <Button
                className="btn-primary"
                style={{ width: "100%" }}
                onClick={handleCheckout}
                disabled={totalQuantity === 0}
              >
                Checkout
              </Button>
            </div>
          </Col>
        </Row>

        <>
          <button className="place-order-btn" disabled={!isCheckoutAvailable}>
            Place order
          </button>

          {isCheckoutAvailable && <Placeorder />}
        </>
      </Container>
    </section>
  );
};

export default Cart;
