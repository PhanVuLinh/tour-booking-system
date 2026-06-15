package com.lvtn.java.controller;

import com.lvtn.java.dto.user.UserRequest;
import com.lvtn.java.dto.user.UserResponse;
import com.lvtn.java.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllActive() {
        return ResponseEntity.ok(userService.findAllActive());
    }

    @GetMapping("/trash")
    public ResponseEntity<List<UserResponse>> getAllTrash() {
        return ResponseEntity.ok(userService.findAllTrash());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(userService.findById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> create(
            @RequestBody UserRequest request,
            @RequestHeader("X-User-Id") Integer accountId
    ) {
        try {
            return ResponseEntity.ok(userService.create(request, accountId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Integer id,
            @RequestBody UserRequest request,
            @RequestHeader("X-User-Id") Integer accountId
    ) {
        try {
            return ResponseEntity.ok(userService.update(id, request, accountId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Integer id,
            @RequestHeader("X-User-Id") Integer accountId
    ) {
        try {
            userService.delete(id, accountId);
            return ResponseEntity.ok("Khóa tài khoản khách hàng thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/restore")
    public ResponseEntity<?> restore(
            @PathVariable Integer id,
            @RequestHeader("X-User-Id") Integer accountId
    ) {
        try {
            userService.restore(id, accountId);
            return ResponseEntity.ok("Mở khóa khách hàng thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}/force")
    public ResponseEntity<?> hardDelete(
            @PathVariable Integer id,
            @RequestHeader("X-User-Id") Integer accountId
    ) {
        try {
            userService.hardDelete(id, accountId);
            return ResponseEntity.ok("Xóa vĩnh viễn khách hàng!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
