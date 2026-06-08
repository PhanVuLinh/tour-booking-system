package com.lvtn.java.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lvtn.java.dto.tour.TourCreateRequest;
import com.lvtn.java.dto.tour.TourResponse;
import com.lvtn.java.service.TourService;
import com.lvtn.java.service.impl.ImageUploadServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/tour")
@RequiredArgsConstructor
public class TourController {

    private final TourService tourService;
    private final ImageUploadServiceImpl imageUploadService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TourResponse> createTour(
            @RequestPart("data") String dataJson,
            @RequestPart("file") MultipartFile file) throws Exception {

        ObjectMapper objectMapper = new ObjectMapper();
        TourCreateRequest request = objectMapper.readValue(dataJson, TourCreateRequest.class);

        String imageUrl = imageUploadService.uploadImage(file);

        return new ResponseEntity<>(
                tourService.createTour(request, imageUrl),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<TourResponse>> getAllTours() {
        return ResponseEntity.ok(tourService.getAllTours());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourResponse> getTourById(@PathVariable Integer id) {
        return ResponseEntity.ok(tourService.getTourById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TourResponse> updateTour(
            @PathVariable Integer id,
            @RequestBody TourCreateRequest request) {
        return ResponseEntity.ok(tourService.updateTour(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTour(@PathVariable Integer id) {
        Integer currentAdminId = 1;
        tourService.deleteTour(id, currentAdminId);
        return ResponseEntity.ok("Xóa Tour thành công!");
    }
}