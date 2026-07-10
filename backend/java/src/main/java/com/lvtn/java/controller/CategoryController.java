package com.lvtn.java.controller;

import com.lvtn.java.dto.category.CategoryResponse;
import com.lvtn.java.dto.category.CategoryUpsertRequest;
import com.lvtn.java.security.SecurityUtils;
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
    private final SecurityUtils securityUtils;

    @GetMapping
    public ResponseEntity<?> findAllActive() {
        try {
            return ResponseEntity.ok(categoryService.findAllActive());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi: " + e.getMessage());
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<?> save(@RequestBody CategoryUpsertRequest request) {
        try {
            Integer creatorId = securityUtils.getCurrentAccountId();
            CategoryResponse response = categoryService.create(request, creatorId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody CategoryUpsertRequest request) {
        try {
            Integer updaterId = securityUtils.getCurrentAccountId();
            CategoryResponse response = categoryService.update(id, request, updaterId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<String> deleteById(@PathVariable Integer id) {
        try {
            Integer deleterId = securityUtils.getCurrentAccountId();
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
    public ResponseEntity<?> restore(@PathVariable Integer id) {
        try {
            Integer restorerId = securityUtils.getCurrentAccountId();
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