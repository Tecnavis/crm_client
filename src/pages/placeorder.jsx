import React, { useEffect, } from 'react';
import './profile.css'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 
import axios from 'axios';
import { useForm } from '../components/useForm';
import { URL } from '../components/handle_api';
import Swal from 'sweetalert2';

const OrderPage = () => {
  const customer = JSON.parse(localStorage.getItem("customerDetails")) || {};
  const selectedProduct = JSON.parse(localStorage.getItem("checkoutDetails")) || { selectedProducts: [], totalAmount: 0, totalQuantity: 0 };

  // Filter out products that have quantity > 0
  const filteredProducts = selectedProduct.selectedProducts?.map(product => ({
    productDetails: {
      id: product.productDetails.id,
      mainCategory: product.productDetails.mainCategory,
      subCategory: product.productDetails.subCategory,
      color: product.productDetails.color,
      price: product.productDetails.price,
      coverImage: product.productDetails.coverImage,
      title: product.productDetails.title,
    },
    sizeDetails: {
      sizeId: product.sizeDetails.sizeId,
      size: product.sizeDetails.size,
      quantity: product.sizeDetails.quantity,
      totalAmount: product.sizeDetails.totalAmount,
    }
  })) || [];
  

  const [values, handleChange, setValues] = useForm({
    customerName: customer.name || "",
    shopName: customer.shopname || "",
    address: customer.address || "",
    phone: customer.phone || "",
    email: customer.email || "",
    Pincode: "",
    paymentMethod: "COD",
    totalAmount: selectedProduct.totalAmount || 0,
    paidAmount: 0,
    balanceAmount: 0,
    paymentStatus: "Unpaid",
    deliveryStatus: "Pending",
    orderDate: new Date(),
    deliveryDate: "",
    note: "",
    products: filteredProducts,  
    customerId: customer._id || "", 
  });
 // Payment status logic
 useEffect(() => {
  const updatedBalanceAmount = values.totalAmount - values.paidAmount;
  let paymentStatus = "Unpaid";

  if (updatedBalanceAmount === 0) {
    paymentStatus = "Paid";
  } else if (updatedBalanceAmount === values.totalAmount) {
    paymentStatus = "Unpaid";
  } else {
    paymentStatus = "Partially Paid";
  }

  setValues(prevValues => ({
    ...prevValues,
    balanceAmount: updatedBalanceAmount,
    paymentStatus: paymentStatus,
  }));
}, [values.paidAmount, values.totalAmount, setValues]);


  // Delivery status logic
  useEffect(() => {
    if (values.deliveryStatus === "Delivered") {
      setValues(prevValues => ({
        ...prevValues,
        deliveryDate: new Date().toISOString().split('T')[0], // current date in YYYY-MM-DD format
      }));
    } else {
      setValues(prevValues => ({
        ...prevValues,
        deliveryDate: "Not Delivered",
      }));
    }
  }, [values.deliveryStatus,setValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Products data:", values.products);  
    
    try {
      const response = await axios.post(`${URL}/customerorder`, values);
      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Order Created",
          text: "Order created successfully.",
        });
        localStorage.removeItem("checkoutDetails");
        setTimeout(() => window.location.reload(), 3000); 
      }
    } catch (error) {
      console.error("Error creating order:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while creating the order.",
      });
    }
  };
  
  return (
    <div className="order-page container">
      <form className="checkout-form" onSubmit={handleSubmit}>
        {/* Customer Details */}
        <div className="form-group">
          <label>Enter Your Name *</label>
          <input type="text" value={customer.name || ""} readOnly />
        </div>
        <div className="form-group">
          <label>Shop Name *</label>
          <input type="text" value={customer.shopname || ""} readOnly />
        </div>
        <div className="form-group">
          <label>Address *</label>
          <input type="text" value={customer.address || ""} readOnly />
        </div>
        <div className="form-group">
          <label>Postcode / ZIP *</label>
          <input
            type="text"
            name="Pincode"
            value={values.Pincode}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone *</label>
          <input type="tel" value={customer.phone || ""} readOnly />
        </div>
        <div className="form-group">
          <label>Email *</label>
          <input type="email" value={customer.email || ""} readOnly />
        </div>
        <div className="form-group">
          <label>Payment Method *</label>
          <select name="paymentMethod" value={values.paymentMethod} onChange={handleChange}>
            <option value="COD">COD</option>
            <option value="UPI">UPI</option>
          </select>
        </div>
        <div className="form-group">
          <label>Payment Status *</label>
          <input
            type="text"
            name="paymentStatus"
            value={values.paymentStatus}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Total Amount</label>
          <input type="number" value={selectedProduct.totalAmount || 0} readOnly />
        </div>
        <div className="form-group">
          <label>Paid Amount</label>
          <input
            type="number"
            name="paidAmount"
            value={values.paidAmount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Balance Amount</label>
          <input type="number" name="balanceAmount" value={values.balanceAmount} readOnly />
        </div>
        <div className="form-group">
          <label>Note</label>
          <textarea name="note" value={values.note} onChange={handleChange} />
        </div>
        <button type="submit" className="place-order-btn">
          Confirm
        </button>
      </form>

      <aside className="order-summary">
        <h3>Your order</h3>
        {filteredProducts && filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <div key={index} className="order-items">
              <p>{product.productDetails.mainCategory} x {product.sizeDetails.quantity}</p>
            </div>
          ))
        ) : (
          <p>No products selected.</p>
        )}

        <hr />
        <div className="summary-totals" style={{height:"auto"}}>
        <p><b>Brand Name </b> <span><b>Unit Price</b></span></p>
        {filteredProducts && filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <div key={index}>
             
              <p>{product.productDetails.subCategory}  <span>{product.productDetails.price || "0"}</span></p>
            </div>
          ))
        ) : (
          <p>No products selected.</p>
        )}
        <hr/>
          <p>Subtotal: <span>{selectedProduct.totalAmount || "0"}</span></p>
          <p>Total Items: <span>{selectedProduct.totalQuantity || "0"}</span></p>
          <p><b>Total Amount: </b><span><b>{selectedProduct.totalAmount || "0"}</b></span></p>
        </div>
        <br />
      </aside>
    </div>
  );
};

export default OrderPage;

