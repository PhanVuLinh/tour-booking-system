import React from "react";
import { formatDate } from "../../../../utils/format.helper";
import { getPassengerTypeName } from "../../../../utils/booking.helper";

export default function BookingPassengerList({ passengers = [] }) {
  if (!passengers || passengers.length === 0) return null;

  return (
    <div className="bd-section lookup-section">
      <h3 className="bd-section-title lookup-section-title">
        <i className="fa-solid fa-user-group lookup-section-icon"></i>
        Danh sách hành khách đi cùng ({passengers.length})
      </h3>

      <div className="bd-passenger-list">
        {passengers.map((passenger, index) => (
          <div className="bd-passenger-card" key={passenger.id || index}>
            <div className="bd-passenger-avatar">
              <i className="fa-solid fa-user"></i>
            </div>

            <div className="bd-passenger-details">
              <div className="bd-pd-header">
                <strong>{passenger.full_name}</strong>

                <span
                  className={`badge-type type-${passenger.passenger_type}`}
                >
                  {getPassengerTypeName(passenger.passenger_type)}
                </span>
              </div>

              <div className="bd-pd-body">
                <span>Giới tính: {passenger.gender || "Không rõ"}</span>
                <span>Ngày sinh: {formatDate(passenger.dob)}</span>
                {passenger.identity_card && (
                  <span>CCCD/Passport: {passenger.identity_card}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
