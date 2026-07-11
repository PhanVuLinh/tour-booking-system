package com.lvtn.java.service;

import com.lvtn.java.dto.departure.DepartureResponse;
import com.lvtn.java.dto.departure.DepartureUpsertRequest;

import java.util.List;

public interface DepartureService {
    List<DepartureResponse> findAll();
    DepartureResponse findById(Integer id);
    DepartureResponse create(DepartureUpsertRequest request, Integer creatorId);
    DepartureResponse update(Integer id, DepartureUpsertRequest request, Integer updaterId);
    void delete(Integer id, Integer userId);
    void restore(Integer id, Integer restorerId);
    void hardDelete(Integer id);
    List<DepartureResponse> findAllTrash();
}