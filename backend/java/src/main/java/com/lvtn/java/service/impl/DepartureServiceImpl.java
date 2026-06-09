package com.lvtn.java.service.impl;

import com.lvtn.java.domain.entity.Departure;
import com.lvtn.java.domain.entity.Tour;
import com.lvtn.java.dto.departure.DepartureResponse;
import com.lvtn.java.dto.departure.DepartureUpsertRequest;
import com.lvtn.java.repository.DepartureRepository;
import com.lvtn.java.repository.TourRepository;
import com.lvtn.java.service.DepartureService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartureServiceImpl implements DepartureService {
    private final DepartureRepository departureRepository;
    private final TourRepository tourRepository;
    private final ModelMapper mapper;

    public DepartureServiceImpl(DepartureRepository departureRepository, TourRepository tourRepository, ModelMapper mapper) {
        this.departureRepository = departureRepository;
        this.tourRepository = tourRepository;
        this.mapper = mapper;
    }

    private DepartureResponse mapToResponse(Departure departure) {
        return mapper.map(departure, DepartureResponse.class);
    }

    public List<DepartureResponse> findAll() {
        return departureRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public DepartureResponse findById(Integer id) {
        Departure departure = departureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Lịch khởi hành với ID: " + id));
        return mapToResponse(departure);
    }



    public DepartureResponse create(DepartureUpsertRequest request) {
        Departure departure = mapper.map(request, Departure.class);

        Tour tour = tourRepository.findById(request.getTourId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Tour với ID: " + request.getTourId()));
        departure.setTourId(tour);

        Departure savedDeparture = departureRepository.save(departure);
        return mapToResponse(savedDeparture);
    }

    public DepartureResponse update(Integer id, DepartureUpsertRequest request) {
        Departure existing = departureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Lịch khởi hành với ID: " + id));

        mapper.map(request, existing);

        if (request.getTourId() != null) {
            Tour tour = tourRepository.findById(request.getTourId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Tour với ID: " + request.getTourId()));
            existing.setTourId(tour);
        }

        Departure updated = departureRepository.save(existing);
        return mapToResponse(updated);
    }

    public void delete(Integer id) {
        Departure existing = departureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Lịch khởi hành với ID: " + id));
        existing.setDeleted(true);
        existing.setDeletedAt(java.time.LocalDateTime.now());
        departureRepository.save(existing);

    }
}