package com.example.filemanagerapp.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

          // DEBUG LOGS
    System.out.println("===========================================");
    System.out.println("REQUEST URL  : " + request.getRequestURI());
    System.out.println("AUTH HEADER  : " + authHeader);

    if (authHeader != null && authHeader.startsWith("Bearer ")) {
        String token = authHeader.substring(7);
        System.out.println("TOKEN FOUND  : " + token);
        System.out.println("VALID TOKEN  : " + jwtUtil.validateToken(token));

        if (jwtUtil.validateToken(token)) {
            String email = jwtUtil.getEmailFromToken(token);
            String role  = jwtUtil.getRoleFromToken(token);

            System.out.println("EMAIL        : " + email);
            System.out.println("ROLE         : " + role);
            System.out.println("AUTHORITY    : " + role);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                List.of(new SimpleGrantedAuthority(role))
                        );
    SecurityContextHolder.getContext().setAuthentication(authentication);
            System.out.println("AUTH SET     : " + authentication.getAuthorities());
        }
    } else {
        System.out.println("NO TOKEN FOUND IN REQUEST!");
    }
    System.out.println("===========================================");
    filterChain.doFilter(request, response);
    }
}