package com.lvtn.java.dto.auth;

public record CurrentAccountResponse(
        Integer id,
        String email,
        String fullName,
        String role,
        String avatar,
        String jobTitle
) {
}
