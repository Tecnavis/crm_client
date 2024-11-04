import React, { useEffect, useState } from "react";
import "./profile.css";
import { URL, fetchOrderDetails } from "../components/handle_api";
import axios from "axios";
import Swal from "sweetalert2";

const OrderDetailsPage = () => {
  // user details
  const user = JSON.parse(localStorage.getItem("customerDetails"));
  const [orderDetails, setOrderDetails] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    shopname: user.shopname,
    _id: user._id,
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!user || !user._id) {
      console.error("User ID is missing.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "User information is missing or invalid.",
      });
      return;
    }

    // Proceed with updating user details
    axios
      .put(`${URL}/customer/${user._id}`, updatedUser)
      .then((response) => {
        localStorage.setItem("customerDetails", JSON.stringify(updatedUser));
        setShowEditModal(false);
        Swal.fire({
          icon: "success",
          title: "Updated Successfully",
          text: "Profile updated successfully.",
        });
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while updating the profile.",
        });
      });
  };

  useEffect(() => {
    fetchOrderDetails()
      .then((data) => {
        if (data && data.orders) {
          setOrderDetails(data.orders);
        }
      })
      .catch((error) => {
        console.error("Error fetching order details:", error);
      });
  }, []);
  // Calculate total quantity and total amount
  const getTotalSummary = () => {
    return orderDetails.reduce(
      (acc, order) => {
        const orderTotal = order.products.reduce((total, product) => {
          const quantity = product.sizeDetails.quantity;
          const price = product.productDetails.price;
          return total + price * quantity;
        }, 0);

        if (
          order.deliveryStatus !== "Cancelled" &&
          order.deliveryStatus !== "Returned"
        ) {
          acc.totalPaidAmount += order.paidAmount;
          acc.totalBalanceAmount += orderTotal - order.paidAmount;
          acc.totalAmount += orderTotal;

          order.products.forEach((product) => {
            acc.totalQuantity += product.sizeDetails.quantity;
          });
        }

        return acc;
      },
      {
        totalQuantity: 0,
        totalAmount: 0,
        totalPaidAmount: 0,
        totalBalanceAmount: 0,
      }
    );
  };

  const { totalQuantity, totalAmount, totalPaidAmount, totalBalanceAmount } =
    getTotalSummary();

  const handleReturnClick = (shopName, productId) => {
    // const returnMessage = `Return requested for Shop: ${shopName}, Product ID: ${productId}`;
    axios
      .post(`${URL}/notification/return-request`, { shopName, productId })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Return Requested",
          text: response.data.message,
        });
      })
      .catch((error) => {
        console.error("Error saving return request:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while processing the return request.",
        });
      });
  };

  const isReturnDisabled = (status) => {
    return ["Returned", "Cancelled"].includes(status);
  };
  return (
    <div className="order-details-page">
      <div className="profile-section">
        <div className="profile-info-card">
          <div className="profile-header">
            <h2 className="user-name">
              {user.name} <span className="shop-name">({user.shopname})</span>
            </h2>
            <hr />
          </div>
          <div className="profile-details">
            <p className="user-email">
              <i className="fas fa-envelope"></i> {user.email}
            </p>
            <p className="user-phone">
              <i className="fas fa-phone"></i> {user.phone}
            </p>
            <p className="user-address">
              <i className="fas fa-map-marker-alt"></i> {user.address}
            </p>
          </div>
          <button
            className="btn btn-primary edit-profile-btn"
            onClick={() => setShowEditModal(true)}
          >
            Edit Profile
          </button>
        </div>
      </div>
      <div className="order-details">
        <h3>Order Details ({orderDetails.length})</h3>
        {orderDetails.length === 0 ? (
          <p>No orders available</p> // Message when no orders are available
        ) : (
          <table className="product-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>OrderId</th>
                <th>Size</th>
                <th>Quantity</th>
                <th>Delivery </th>
                <th>Return</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(orderDetails) &&
                orderDetails.map((order, index) =>
                  order.products.map((product, productIndex) => (
                    <tr key={`${index}-${productIndex}`}>
                      <td>
                        <div className="product-info">
                          <img
                            src={`${URL}/images/${product.productDetails.coverImage}`}
                            alt=""
                          />
                          <div>
                            <p>
                              {" "}
                              {product.productDetails.mainCategory}
                              <br />
                              Color: {product.productDetails.color}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>{order.orderId}</td>
                      <td>{product.sizeDetails.size}</td>
                      <td>
                        {`${product.productDetails.price} X ${product.sizeDetails.quantity}`}
                        <br />
                        {`$${(
                          product.productDetails.price *
                          product.sizeDetails.quantity
                        ).toFixed(2)}`}
                      </td>

                      <td
                        style={{
                          color:
                            order.deliveryStatus === "Delivered"
                              ? "green"
                              : "red",
                        }}
                      >
                        {order.deliveryStatus}
                      </td>

                      <td>
                        <button
                          className={`btn-primary ${
                            isReturnDisabled(order.deliveryStatus)
                              ? "disabled"
                              : ""
                          }`}
                          onClick={() =>
                            handleReturnClick(user.shopname, order.orderId)
                          }
                          disabled={isReturnDisabled(order.deliveryStatus)}
                        >
                          Return
                        </button>
                      </td>
                    </tr>
                  ))
                )}
            </tbody>
          </table>
        )}
        <div className="order-summary" style={{ marginInline: "7px" }}>
          <h3>Order Summary</h3>
          <hr />
          <ul>
            <li>
              <span>Total Quantity:</span>
              <span>{totalQuantity}</span>
            </li>
            <li>
              <span>Subtotal:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </li>
            <li className="total">
              <span>Total:</span>
              <span>${totalAmount.toFixed(2)}</span>{" "}
            </li>
            <li>
              <span>Paid Amount:</span>
              <span>${totalPaidAmount.toFixed(2)}</span>
            </li>
            <li>
              <span>Balance Amount:</span>
              <span>${totalBalanceAmount.toFixed(2)}</span>
            </li>
          </ul>
        </div>
      </div>{" "}
      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h4>Edit Profile</h4>
            <hr />
            <form>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={updatedUser.name}
                onChange={handleInputChange}
              />

              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={updatedUser.email}
                onChange={handleInputChange}
              />

              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={updatedUser.phone}
                onChange={handleInputChange}
              />

              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={updatedUser.address}
                onChange={handleInputChange}
              />

              <label>Shop Name:</label>
              <input
                type="text"
                name="shopname"
                value={updatedUser.shopname}
                onChange={handleInputChange}
              />

              <button
                type="button"
                onClick={handleSave}
                className="btn-primary"
              >
                Save
              </button>
              <br />
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="btn-secondary"
                style={{ width: "100%" }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
