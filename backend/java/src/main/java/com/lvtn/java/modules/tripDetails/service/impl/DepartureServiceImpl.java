package com.lvtn.java.modules.tripDetails.service.impl;

import com.lvtn.java.modules.tripDetails.entity.Departure;
import com.lvtn.java.modules.tour.entity.Tour;
import com.lvtn.java.modules.tripDetails.entity.Vehicle;
import com.lvtn.java.dto.departure.DepartureResponse;
import com.lvtn.java.dto.departure.DepartureUpsertRequest;
import com.lvtn.java.modules.tripDetails.repository.DepartureRepository;
import com.lvtn.java.modules.tour.repository.TourRepository;
import com.lvtn.java.modules.tripDetails.repository.VehicleRepository;
import com.lvtn.java.modules.tripDetails.service.DepartureService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class DepartureServiceImpl implements DepartureService {
    private final DepartureRepository departureRepository;
    private final TourRepository tourRepository;
    private final VehicleRepository vehicleRepository;
    private final ModelMapper mapper;

    public DepartureServiceImpl(DepartureRepository departureRepository, TourRepository tourRepository, VehicleRepository vehicleRepository, ModelMapper mapper) {
        this.departureRepository = departureRepository;
        this.tourRepository = tourRepository;
        this.vehicleRepository = vehicleRepository;
        this.mapper = mapper;
        this.mapper.typeMap(Departure.class, DepartureResponse.class)
                .addMappings(m -> m.skip(DepartureResponse::setTourId))
                .addMappings(m -> m.skip(DepartureResponse::setVehicleId));
        this.mapper.typeMap(DepartureUpsertRequest.class, Departure.class)
                .addMappings(m -> m.skip(Departure::setTourId))
                .addMappings(m -> m.skip(Departure::setVehicle))
                .addMappings(m -> m.skip(Departure::setUpdatedBy));
    }

    private DepartureResponse mapToResponse(Departure departure) {
        DepartureResponse response = mapper.map(departure, DepartureResponse.class);

        if (departure.getTourId() != null) {
            response.setTourId(departure.getTourId().getId());
            response.setTourTitle(departure.getTourId().getTitle());
        }
        if (departure.getVehicle() != null) {
            response.setVehicleId(departure.getVehicle().getId());
            response.setVehicleName(departure.getVehicle().getName());
            response.setVehicleType(departure.getVehicle().getVehicleType());
        }

        return response;
    }

    public List<DepartureResponse> findAll() {
        return departureRepository.findAllActive().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public DepartureResponse findById(Integer id) {
        Departure departure = departureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Lịch khởi hành với ID: " + id));
        return mapToResponse(departure);
    }

    public DepartureResponse create(DepartureUpsertRequest request, Integer creatorId) {
        Departure departure = mapper.map(request, Departure.class);

        Tour tour = tourRepository.findById(request.getTourId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Tour với ID: " + request.getTourId()));
        departure.setTourId(tour);

        if (request.getVehicleId() != null) {
            Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Phương tiện với ID: " + request.getVehicleId()));
            departure.setVehicle(vehicle);
        }

        departure.setCreatedBy(creatorId);
        departure.setUpdatedBy(creatorId);

        Departure savedDeparture = departureRepository.save(departure);
        return mapToResponse(savedDeparture);
    }

    public DepartureResponse update(Integer id, DepartureUpsertRequest request, Integer updaterId) {
        Departure existing = departureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Lịch khởi hành với ID: " + id));
        mapper.map(request, existing);
        existing.setUpdatedBy(updaterId);
        existing.setUpdatedAt(LocalDateTime.now());

        if (request.getTourId() != null) {
            Tour tour = tourRepository.findById(request.getTourId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Tour với ID: " + request.getTourId()));
            existing.setTourId(tour);
        }

        if (request.getVehicleId() != null) {
            Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Phương tiện với ID: " + request.getVehicleId()));
            existing.setVehicle(vehicle);
        } else {
            existing.setVehicle(null);
        }
        Departure updated = departureRepository.save(existing);
        return mapToResponse(updated);
    }

    public void delete(Integer id, Integer userId) {
        Departure existing = departureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Lịch khởi hành với ID: " + id));
        existing.setDeleted(true);
        existing.setDeletedAt(LocalDateTime.now());
        if (userId != null) {
            existing.setDeletedBy(userId);
        }
        departureRepository.save(existing);
    }

    public List<DepartureResponse> findAllTrash() {
        return departureRepository.findAllTrash().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public void restore(Integer id, Integer restorerId) {
        Departure existing = departureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Lịch khởi hành với ID: " + id));

        existing.setDeleted(false);
        existing.setDeletedAt(null);
        existing.setDeletedBy(null);
        existing.setUpdatedBy(restorerId);

        departureRepository.save(existing);
    }

    public void hardDelete(Integer id) {
        Departure existing = departureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Lịch khởi hành với ID: " + id));

        departureRepository.delete(existing);
    }
}