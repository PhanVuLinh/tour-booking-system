package com.lvtn.java.repository;

import com.lvtn.java.domain.entity.Departure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface DepartureRepository extends JpaRepository<Departure, Integer> {
    @Query(value = "SELECT COUNT(*) FROM departures WHERE tour_id = :tourId AND deleted = 0", nativeQuery = true)
    int countDeparturesByTourId(@Param("tourId") Integer tourId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM departures WHERE tour_id = :tourId", nativeQuery = true)
    void hardDeleteDeparturesByTourId(@Param("tourId") Integer tourId);

    @Query("SELECT d FROM Departure d WHERE d.deleted = false")
    List<Departure> findAllActive();

    @Query("SELECT d FROM Departure d WHERE d.deleted = true")
    List<Departure> findAllTrash();
}
