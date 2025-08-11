package com.mesh.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers(HttpMethod.POST, "/users/signup", "/users/login").permitAll()

                        // Admin-only endpoints
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // Student-only endpoints
                        .requestMatchers("/api/student/**").hasRole("STUDENT")
                        .requestMatchers(HttpMethod.POST, "/api/classrooms/{classroomId}/assignments/{assignmentId}/submit").hasRole("STUDENT")

                        // Faculty-only endpoints
                        .requestMatchers("/api/classrooms/**").hasRole("FACULTY")

                        // Default rule for any other request
                        .anyRequest().authenticated()
                )
                .httpBasic();

        return http.build();
    }
}