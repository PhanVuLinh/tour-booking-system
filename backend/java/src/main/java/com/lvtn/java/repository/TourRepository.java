package com.lvtn.java.repository;

import com.lvtn.java.domain.entity.Tour;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TourRepository extends JpaRepository<Tour, Integer> {
    boolean existsBySlug(String slug);
}
