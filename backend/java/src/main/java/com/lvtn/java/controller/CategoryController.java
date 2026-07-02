package com.lvtn.java.controller;

import com.lvtn.java.dto.category.CategoryResponse;
import com.lvtn.java.dto.category.CategoryUpsertRequest;
import com.lvtn.java.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/category")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<?> findAllActive() {
        try {
            return ResponseEntity.ok(categoryService.findAllActive());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> save(
            @RequestBody CategoryUpsertRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Integer creatorId) {
        try {
            CategoryResponse response = categoryService.create(request, creatorId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Integer id,
            @RequestBody CategoryUpsertRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Integer updaterId) {
        try {
            CategoryResponse response = categoryService.update(id, request, updaterId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteById(
            @PathVariable Integer id,
            @RequestHeader(value = "X-User-Id", required = false) Integer deleterId) {
        try {
            categoryService.delete(id, deleterId);
            return ResponseEntity.ok("Đã chuyển danh mục vào thùng rác thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi xóa: " + e.getMessage());
        }
    }

    @GetMapping("/trash")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> findAllTrash() {
        try {
            return ResponseEntity.ok(categoryService.findAllTrash());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi tải thùng rác: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/restore")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> restore(
            @PathVariable Integer id,
            @RequestHeader(value = "X-User-Id", required = false) Integer restorerId) {
        try {
            categoryService.restore(id, restorerId);
            return ResponseEntity.ok("Khôi phục danh mục thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi khôi phục: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}/force")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> hardDelete(@PathVariable Integer id) {
        try {
            categoryService.hardDelete(id);
            return ResponseEntity.ok("Đã xóa vĩnh viễn danh mục");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi xóa vĩnh viễn: " + e.getMessage());
        }
    }
}