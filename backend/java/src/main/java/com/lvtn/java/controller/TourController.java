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
    public ResponseEntity<?> deleteTour(@PathVariable Integer id) {
        try {
            tourService.deleteTour(id);

            return ResponseEntity.ok("Đã chuyển Tour vào thùng rác thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi hệ thống: " + e.getMessage());
        }
    }
    @GetMapping
    public ResponseEntity<?> getAllActiveTours() {
        try {
            return ResponseEntity.ok(tourService.findAllActive());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi tải danh sách: " + e.getMessage());
        }
    }

    @GetMapping("/trash")
    public ResponseEntity<?> getAllTrashTours() {
        try {
            return ResponseEntity.ok(tourService.findAllTrash());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi tải thùng rác: " + e.getMessage());
        }
    }
    @PutMapping("/{id}/restore")
    public ResponseEntity<?> restoreTour(@PathVariable Integer id) {
        try {
            tourService.restore(id);
            return ResponseEntity.ok("Khôi phục tour thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khôi phục: " + e.getMessage());
        }
    }
    @DeleteMapping("/{id}/force")
    public ResponseEntity<?> hardDeleteTour(@PathVariable Integer id) {
        try {
            tourService.hardDelete(id);
            return ResponseEntity.ok("Đã xóa vĩnh viễn tour khỏi hệ thống!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Không thể xóa vĩnh viễn: " + e.getMessage());
        }
    }
}