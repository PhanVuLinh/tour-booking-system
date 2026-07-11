package com.lvtn.java.modules.user.controller;

import com.lvtn.java.modules.user.entity.Role;
import com.lvtn.java.dto.role.RoleResponse;
import com.lvtn.java.modules.user.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleRepository roleRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RoleResponse>> getAll() {
        List<Role> roles = new ArrayList<>();
        roleRepository.findAll().forEach(roles::add);

        List<RoleResponse> response = roles.stream()
                .filter(r -> !Boolean.TRUE.equals(r.getDeleted()))
                .map(r -> new RoleResponse(r.getId(), r.getName()))
                .toList();

        return ResponseEntity.ok(response);
    }
}