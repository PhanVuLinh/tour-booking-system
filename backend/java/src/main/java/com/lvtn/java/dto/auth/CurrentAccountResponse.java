package com.lvtn.java.dto.auth;

public record CurrentUserResponse(
        Integer id,
        String email,
        String fullName,
        String role,
        String avatar,
        String jobTitle
) {
}
