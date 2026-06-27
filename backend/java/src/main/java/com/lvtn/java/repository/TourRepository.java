package com.lvtn.java.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lvtn.java.domain.entity.Tour;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TourRepository extends JpaRepository<Tour, Integer> {
    boolean existsBySlug(String slug);
    int countByCategoryIdAndDeletedFalse(Integer categoryId);
    boolean existsByCategoryIdAndDeletedFalse(Integer categoryId);

    @Query(value = "SELECT * FROM tours WHERE deleted = 0", nativeQuery = true)
    List<Tour> findAllActiveTours();

    @Query(value = "SELECT * FROM tours WHERE deleted = 1", nativeQuery = true)
    List<Tour> findAllTrashTours();

    @Transactional
    @Modifying
    @Query(value = "UPDATE tours SET deleted = 0, deletedAt = NULL, deletedBy = NULL, updatedBy = :updaterId WHERE id = :id", nativeQuery = true)
    void restoreTourNative(@Param("id") Integer id, @Param("updaterId") Integer updaterId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM tours WHERE id = :id", nativeQuery = true)
    void hardDeleteTourNative(@Param("id") Integer id);
}