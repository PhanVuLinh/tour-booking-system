package com.lvtn.java.modules.about.repository;

import com.lvtn.java.modules.about.entity.Review;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    @EntityGraph(attributePaths = {"user", "tour", "booking"})
    List<Review> findByDeletedFalse();

    @EntityGraph(attributePaths = {"user", "tour", "booking"})
    List<Review> findByTourIdAndDeletedFalseAndIsApprovedTrue(Integer tourId);

    @EntityGraph(attributePaths = {"user", "tour", "booking"})
    List<Review> findByDeletedTrue();

    @Override
    @EntityGraph(attributePaths = {"user", "tour", "booking"})
    Optional<Review> findById(Integer id);
}