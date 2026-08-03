import React from "react";
import { useOutletContext } from "react-router-dom";
import { Step2Payment } from "../components";

export default function BookingPayment() {
  const {
    formData,
    payment_type,
    setPaymentType,
    payment_method,
    setPaymentMethod,
  } = useOutletContext();

  return (
    <Step2Payment
      formData={formData}
      payment_type={payment_type}
      setPaymentType={setPaymentType}
      payment_method={payment_method}
      setPaymentMethod={setPaymentMethod}
    />
  );
}
