import React, { useContext, useEffect } from "react";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";

const Verify = () => {
  const [searchParam] = useSearchParams();
  const success = searchParam.get("success");
  const orderId = searchParam.get("orderId");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      const res = await axios.post(url + "/api/order/verify", {
        success,
        orderId,
      });
      if (res.data.success) {
        navigate("/myorders");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      navigate("/");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []); // Empty dependency array ensures this runs only once after the initial render

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
