package com.lvtn.java.modules.booking.repository;

import com.lvtn.java.modules.booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findByDeletedFalse();
    Optional<Booking> findByBookingCode(String bookingCode);
}