package com.lvtn.java.repository;

import com.lvtn.java.domain.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {
    List<Schedule> findByTourIdAndDeletedFalseOrderByDayNumberAsc(Integer tourId);
    @Modifying
    @Query("UPDATE Schedule s SET s.deleted = true WHERE s.tour.id = :tourId")
    void softDeleteByTourId(Integer tourId);
}
