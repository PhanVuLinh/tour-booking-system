package com.lvtn.java.controller;

import com.lvtn.java.dto.account.AccountRequest;
import com.lvtn.java.dto.account.AccountResponse;
import com.lvtn.java.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;
    @GetMapping
    public ResponseEntity<List<AccountResponse>> getAllActive() {
        return ResponseEntity.ok(accountService.findAllActive());
    }

    @GetMapping("/trash")
    public ResponseEntity<List<AccountResponse>> getAllTrash() {
        return ResponseEntity.ok(accountService.findAllTrash());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(accountService.findById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> create(
            @RequestBody AccountRequest request,
            @RequestHeader("X-User-Id") Integer adminId
    ) {
        try {
            return ResponseEntity.ok(accountService.create(request, adminId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Integer id,
            @RequestBody AccountRequest request,
            @RequestHeader("X-User-Id") Integer adminId
    ) {
        try {
            return ResponseEntity.ok(accountService.update(id, request, adminId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Integer id,
            @RequestHeader("X-User-Id") Integer adminId
    ) {
        try {
            accountService.delete(id, adminId);
            return ResponseEntity.ok("Đã chuyển tài khoản vào thùng rác thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/restore")
    public ResponseEntity<?> restore(@PathVariable Integer id) {
        try {
            accountService.restore(id);
            return ResponseEntity.ok("Khôi phục tài khoản thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}/force")
    public ResponseEntity<?> hardDelete(@PathVariable Integer id) {
        try {
            accountService.hardDelete(id);
            return ResponseEntity.ok("Đã xóa vĩnh viễn tài khoản!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}