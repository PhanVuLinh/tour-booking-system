package com.lvtn.java.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lvtn.java.domain.entity.Tour;

public interface TourRepository extends JpaRepository<Tour, Integer> {
    boolean existsBySlug(String slug);
    int countByCategoryIdAndDeletedFalse(Integer categoryId);
    boolean existsByCategoryIdAndDeletedFalse(Integer categoryId);
}
