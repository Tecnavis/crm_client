import axios from "axios";
import Swal from "sweetalert2";

// export const  URL = `${process.env.BASE_URL}`;
export const  URL = `http://localhost:3001`;
//customer orders fetching by customer Id
export const fetchOrderDetails = async () => {
  const token = localStorage.getItem("token");
  const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));
  const customerId = customerDetails._id;
  try {
      const { data } = await axios.get(`${URL}/customerorder/${customerId}`, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      return data;
  } catch (error) {
      console.error("Error fetching order details:", error);
      throw error;
  }
};
//delete customer cart
export const deleteCustomerCart =async (id) => {
  const token = localStorage.getItem("token");
  try {
    const { data } = await axios.delete(`${URL}/customercart/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Cart Item Removed successfully",
    });
    return data;
  } catch (error) {
    console.error("Error deleting Cart Item:", error);
    throw error;
  }
};
//get all customer cart of this customer
export const fetchCustomerCart = async () => {
  const token = localStorage.getItem("token");
  const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));
  const customerId = customerDetails._id;
  try {
    const { data } = await axios.get(`${URL}/customercart/${customerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error fetching customer cart:", error);
    throw error;
  }
};

//create customer cart
export const createCustomerCart = async (data) => {
  try {
    const { data: response } = await axios.post(`${URL}/customercart`, data);
    return response;
  } catch (error) {
    if (error.response && error.response.data) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response.data.message || "An error occurred",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong, please try again later.",
      });
    }
    throw error;
  }
}
//delete wishlist
export const deleteWishlist = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.delete(`${URL}/favorite/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Wishlist deleted successfully",
      });
      return data;
    } catch (error) {
      console.error("Error deleting wishlist:", error);
      throw error;
    }
  };

//get all wishlist of this customer
export const fetchWishlist = async () => {
    const token = localStorage.getItem("token");
    const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));
    const customerId = customerDetails._id;
    try {
      const { data } = await axios.get(`${URL}/favorite/customers/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      throw error;
    }
  };
  
  
//  createWishlist function
export const createWishlist = async (wishlistData) => {
  try {
    const { data: response } = await axios.post(`${URL}/favorite`, wishlistData);
    return response;
  } catch (error) {
    if (error.response && error.response.data) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response.data.message || "An error occurred",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong, please try again later.",
      });
    }
    throw error;
  }
};

//sign in customer
export const signInCustomer = async (data) => {
  try {
    const { data: response } = await axios.post(`${URL}/customer/login`, data);
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Customer logged in successfully",
    });
    localStorage.setItem("token", response.token);
    localStorage.setItem(
      "customerDetails",
      JSON.stringify(response.customerDetails)
    );
    window.location.href = "/home";
    return response;
  } catch (error) {
    console.error("Login error:", error);
    if (error.response) {
      console.error("Error response:", error.response.data);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response.data.message || "An error occurred",
      });
    } else if (error.request) {
      console.error("Error request:", error.request);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No response received from server",
      });
    } else {
      console.error("Error message:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong, please try again later.",
      });
    }
  }
};
//create customer
export const createCustomer = async (data) => {
  try {
    const { data: response } = await axios.post(`${URL}/customer`, data);
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Customer created successfully",
    });
    return response;
  } catch (error) {
    if (error.response && error.response.data) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response.data.message || "An error occurred", // Show the specific error message
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong, please try again later.",
      });
    }
  }
};

//fetch logo
export const fetchLogo = async () => {
    const { data } = await axios.get(`${URL}/logo`);
    return data;
}
//fetch category
export const fetchCategory = async () => {
    const { data } = await axios.get(`${URL}/category`);
    return data;
};
//fetch banner
export const fetchBanner = async () => {
    const { data } = await axios.get(`${URL}/banner`);
    return data;
};

//fetch products
export const fetchProducts = async () => {
    const { data } = await axios.get(`${URL}/product`);
    return data;
};


export const fetchProductsbyCategory = async (categoryName) => {
    try {
        const response = await fetch(`${URL}/product/category/products?category=${categoryName}`);
        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Error response:', response.status, errorBody);
            if (response.status === 404) {
                return []; // Return empty array for "No products found"
            }
            throw new Error(`Network response was not ok: ${response.status} ${errorBody}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error; // Re-throw the error to be handled by the component
    }
};