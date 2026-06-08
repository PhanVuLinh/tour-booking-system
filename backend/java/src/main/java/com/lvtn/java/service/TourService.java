package com.lvtn.java.service;

import com.lvtn.java.dto.tour.TourCreateRequest;
import com.lvtn.java.dto.tour.TourResponse;

import java.util.List;

public interface TourService {
    TourResponse createTour(TourCreateRequest request, String imageUrl);
    TourResponse getTourById(Integer id);
    List<TourResponse> getAllTours();
    TourResponse updateTour(Integer id, TourCreateRequest request);
    void deleteTour(Integer id, Integer deletedByAdminId);
}
