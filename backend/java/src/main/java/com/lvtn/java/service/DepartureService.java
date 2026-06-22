package com.lvtn.java.service;

import com.lvtn.java.dto.departure.DepartureResponse;
import com.lvtn.java.dto.departure.DepartureUpsertRequest;

import java.util.List;

public interface DepartureService {
    List<DepartureResponse> findAll();
    DepartureResponse findById(Integer id);
    DepartureResponse create(DepartureUpsertRequest request);
    DepartureResponse update(Integer id, DepartureUpsertRequest request);
    void delete(Integer id);
}
