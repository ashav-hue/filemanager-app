package com.example.filemanagerapp.service;

import com.example.filemanagerapp.dto.LoginRequest;
import com.example.filemanagerapp.dto.LoginResponse;
import com.example.filemanagerapp.entity.User;
import com.example.filemanagerapp.repository.UserRepository;
import com.example.filemanagerapp.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is active
        if (!user.isActive()) {
            throw new RuntimeException("User account is disabled");
        }

        // Validate password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        return new LoginResponse(
                token,
                user.getRole(),
                user.getFullName(),
                user.getId()
        );
    }
}