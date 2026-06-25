package com.lvtn.java.service.impl;

import com.github.slugify.Slugify;
import com.lvtn.java.domain.entity.Tour;
import com.lvtn.java.dto.tour.TourCreateRequest;
import com.lvtn.java.dto.tour.TourResponse;
import com.lvtn.java.repository.DepartureRepository;
import com.lvtn.java.repository.TourRepository;
import com.lvtn.java.service.ScheduleService;
import com.lvtn.java.service.TourService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.text.Normalizer;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class TourServiceImpl implements TourService {

    private final TourRepository tourRepository;
    private final DepartureRepository departureRepository;
    private final ScheduleService scheduleService;

    private String generateSlug(String title) {
        if (title == null || title.isEmpty()) {
            return "";
        }
        String normalized = Normalizer.normalize(title, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String slug = pattern.matcher(normalized).replaceAll("").toLowerCase();
        slug = slug.replaceAll("[^a-z0-9\\-]", "-");
        slug = slug.replaceAll("-+", "-");
        slug = slug.replaceAll("^-|-$", "");

        return slug;
    }

    @Override
    @Transactional
    public TourResponse createTour(TourCreateRequest request, String imageUrl) {
        String baseSlug = generateSlug(request.getTitle());
        String slug = baseSlug;
        if (tourRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + System.currentTimeMillis();
        }

        Tour tour = Tour.builder()
                .categoryId(request.getCategoryId())
                .title(request.getTitle())
                .slug(slug)
                .description(request.getDescription())
                .time(request.getTime())
                .thumbnail(imageUrl)
                .status(request.getStatus() != null ? request.getStatus() : "active")
                .build();

        return mapToResponse(tourRepository.save(tour));
    }

    @Override
    public TourResponse getTourById(Integer id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Tour với ID: " + id));

        TourResponse response = mapToResponse(tour);
        response.setSchedules(scheduleService.getSchedulesByTourId(id));

        return response;
    }

    @Override
    public List<TourResponse> getAllTours() {
        return tourRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TourResponse updateTour(Integer id, TourCreateRequest request) {
        Tour existingTour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Tour với ID: " + id));
        if (request.getThumbnail() != null && !request.getThumbnail().isBlank()) {
            existingTour.setThumbnail(request.getThumbnail());
        }
        existingTour.setCategoryId(request.getCategoryId());
        existingTour.setTitle(request.getTitle());
        existingTour.setDescription(request.getDescription());
        existingTour.setTime(request.getTime());
        existingTour.setStatus(request.getStatus());
        existingTour.setUpdatedBy(request.getCreatedBy());
        Tour updatedTour = tourRepository.save(existingTour);
        return mapToResponse(updatedTour);
    }

    @Override
    @Transactional
    public void deleteTour(Integer id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Tour với ID: " + id));

        int departureCount = departureRepository.countDeparturesByTourId(id);

        if (departureCount > 0) {
            throw new RuntimeException("Không thể chuyển vào thùng rác! Tour này đang có " + departureCount + " lịch khởi hành hoạt động.");
        }

        tour.setDeleted(true);
        tour.setDeletedAt(LocalDateTime.now());

        tourRepository.save(tour);
    }

    private TourResponse mapToResponse(Tour tour) {
        TourResponse response = new TourResponse();
        BeanUtils.copyProperties(tour, response);
        return response;
    }

    @Override
    public List<TourResponse> findAllActive() {
        return tourRepository.findAllActiveTours().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<TourResponse> findAllTrash() {
        return tourRepository.findAllTrashTours().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public void restore(Integer id) {
        tourRepository.restoreTourNative(id);
    }

    @Override
    @Transactional
    public void hardDelete(Integer id) {
        departureRepository.hardDeleteDeparturesByTourId(id);
        tourRepository.hardDeleteTourNative(id);
    }
}