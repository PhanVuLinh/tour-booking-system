package com.lvtn.java.service;

import com.lvtn.java.dto.auth.*;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse refresh(RefreshTokenRequest request);
    void changePassword(String email, ChangePasswordRequest request);
    CurrentAccountResponse me(String email);
    void logout(String email);
}
