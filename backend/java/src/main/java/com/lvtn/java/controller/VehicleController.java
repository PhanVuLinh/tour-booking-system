package com.lvtn.java.controller;

import com.lvtn.java.dto.vehicle.VehicleResponse;
import com.lvtn.java.dto.vehicle.VehicleUpsertRequest;
import com.lvtn.java.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicle")
@RequiredArgsConstructor
public class VehicleController {
    private final VehicleService vehicleService;

    @GetMapping
    public ResponseEntity<List<VehicleResponse>> getAllActive() {
        return ResponseEntity.ok(vehicleService.findAllActive());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(vehicleService.findById(id));
    }

    @PostMapping
    public ResponseEntity<VehicleResponse> create(
            @RequestBody VehicleUpsertRequest request,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Integer creatorId) {
        return ResponseEntity.ok(vehicleService.create(request, creatorId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehicleResponse> update(
            @PathVariable Integer id,
            @RequestBody VehicleUpsertRequest request,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Integer updaterId) {
        return ResponseEntity.ok(vehicleService.update(id, request, updaterId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer id,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Integer deleterId) {
        vehicleService.delete(id, deleterId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/trash")
    public ResponseEntity<List<VehicleResponse>> getTrash() {
        return ResponseEntity.ok(vehicleService.findDeleted());
    }

    @PutMapping("/{id}/restore")
    public ResponseEntity<VehicleResponse> restore(
            @PathVariable Integer id,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Integer updaterId) {
        return ResponseEntity.ok(vehicleService.restore(id, updaterId));
    }

    @DeleteMapping("/{id}/force")
    public ResponseEntity<Void> hardDelete(@PathVariable Integer id) {
        vehicleService.hardDelete(id);
        return ResponseEntity.noContent().build();
    }
}
