package com.lvtn.java.controller;

import com.lvtn.java.dto.departure.DepartureResponse;
import com.lvtn.java.dto.departure.DepartureUpsertRequest;
import com.lvtn.java.service.DepartureService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departure")
public class DepartureController {
    private final DepartureService departureService;

    public DepartureController(DepartureService departureService) {
        this.departureService = departureService;
    }

    @GetMapping
    public ResponseEntity<List<DepartureResponse>> getAll() {
        return ResponseEntity.ok(departureService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartureResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(departureService.findById(id));
    }

    @GetMapping("/trash")
    public ResponseEntity<List<DepartureResponse>> getAllTrash() {
        return ResponseEntity.ok(departureService.findAllTrash());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody DepartureUpsertRequest request) {
        try{
            return ResponseEntity.ok(departureService.create(request));
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @PutMapping("/{id}")
    public ResponseEntity<DepartureResponse> update(@PathVariable Integer id, @RequestBody DepartureUpsertRequest request) {
        return ResponseEntity.ok(departureService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id, @RequestParam Integer userId) {
        departureService.delete(id, userId);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/{id}/restore")
    public ResponseEntity<Void> restore(@PathVariable Integer id) {
        departureService.restore(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/force")
    public ResponseEntity<Void> hardDelete(@PathVariable Integer id) {
        departureService.hardDelete(id);
        return ResponseEntity.ok().build();
    }
}