package com.lvtn.java.repository;

import com.lvtn.java.domain.entity.TourImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TourImageRepository extends JpaRepository<TourImage, Integer> {
    List<TourImage> findByTourIdAndDeletedFalse(Integer tourId);

    @Transactional
    @Modifying
    @Query("UPDATE TourImage ti SET ti.deleted = true, ti.deletedBy = :deleterId WHERE ti.tourId = :tourId")
    void softDeleteByTourId(Integer tourId, Integer deleterId);
}
