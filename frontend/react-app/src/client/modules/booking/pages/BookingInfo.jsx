import React from "react";
import { useOutletContext } from "react-router-dom";
import Step1Info from "../components/Step1Info";

export default function BookingInfo() {
  const { adultCount, childCount, infantCount, updatePassenger } =
    useOutletContext();

  return (
    <Step1Info
      adultCount={adultCount}
      childCount={childCount}
      infantCount={infantCount}
      updatePassenger={updatePassenger}
    />
  );
}
