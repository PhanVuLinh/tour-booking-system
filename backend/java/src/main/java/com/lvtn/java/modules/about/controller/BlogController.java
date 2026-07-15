package com.lvtn.java.modules.about.controller;

import com.lvtn.java.dto.blog.BlogRequest;
import com.lvtn.java.dto.blog.BlogResponse;
import com.lvtn.java.modules.about.service.BlogService;
import com.lvtn.java.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/blogs")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;
    private final SecurityUtils securityUtils;

    @GetMapping
    public ResponseEntity<List<BlogResponse>> findAll() {
        return ResponseEntity.ok(blogService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(blogService.findById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/trash")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BlogResponse>> findAllTrash() {
        return ResponseEntity.ok(blogService.findAllTrash());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<?> create(@RequestBody BlogRequest request) {
        try {
            Integer creatorId = securityUtils.getCurrentAccountId();
            String imageUrl = request.getThumbnail();
            BlogResponse response = blogService.create(request, imageUrl, creatorId);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody BlogRequest request) {
        try {
            Integer updaterId = securityUtils.getCurrentAccountId();
            String imageUrl = request.getThumbnail();
            BlogResponse response = blogService.update(id, request, imageUrl, updaterId);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            Integer deleterId = securityUtils.getCurrentAccountId();
            blogService.delete(id, deleterId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/restore")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> restore(@PathVariable Long id) {
        try {
            Integer restorerId = securityUtils.getCurrentAccountId();
            blogService.restore(id, restorerId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}/force")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> hardDelete(@PathVariable Long id) {
        try {
            blogService.hardDelete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}