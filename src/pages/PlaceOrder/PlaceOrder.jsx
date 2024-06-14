import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
const PlaceOrder = () => {
  const navigate = useNavigate();
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
  });
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];
      food_list.forEach((item) => {
        if (cartItems[item._id] > 0) {
          let itemInfo = { ...item, quantity: cartItems[item._id] };
          orderItems.push(itemInfo);
        }
      });

      let orderData = {
        address: data,
        items: orderItems,
        amount: getTotalCartAmount() + 2,
      };

      console.log("Order Data:", orderData); // Log order data for debugging

      let response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token },
      });

      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error("Error placing order:", error); // Log the error details
      alert("An error occurred while placing your order. Please try again.");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }),
    [token];
  return (
    <>
      <form action="" className="place-order" onSubmit={placeOrder}>
        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="multi-fields">
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              onChange={onChangeHandler}
              value={data.firstName}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              onChange={onChangeHandler}
              value={data.lastName}
              required
            />
          </div>
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            required
          />
          <input
            type="text"
            placeholder="Street"
            name="street"
            onChange={onChangeHandler}
            value={data.street}
            required
          />
          <div className="multi-fields">
            <input
              type="text"
              placeholder="City"
              name="city"
              onChange={onChangeHandler}
              value={data.city}
              required
            />
            <input
              type="text"
              placeholder="State"
              name="state"
              onChange={onChangeHandler}
              value={data.state}
              required
            />
          </div>
          <div className="multi-fields">
            <input
              type="text"
              placeholder="Zip Code"
              name="zipcode"
              onChange={onChangeHandler}
              value={data.zipcode}
              required
            />
            <input
              type="text"
              placeholder="Country"
              name="country"
              onChange={onChangeHandler}
              value={data.country}
              required
            />
          </div>
          <input
            type="text"
            placeholder="Phone"
            name="phone"
            onChange={onChangeHandler}
            value={data.phone}
            required
          />
        </div>
        <div className="place-order-right">
          <div className="cart-total">
            <h2>Your Total</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>${getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
              </div>
              <hr />

              <div className="cart-total-details">
                <p>Total</p>
                <b>
                  ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
                </b>
              </div>
            </div>
            <button type="submit">Check Out</button>
          </div>
        </div>
      </form>
    </>
  );
};

export default PlaceOrder;
