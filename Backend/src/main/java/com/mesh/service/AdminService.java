package com.mesh.service;

import com.mesh.model.User;
import com.mesh.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Creates a single user. Throws an exception if the email already exists.
     * @param user The user object to be created.
     * @return The saved user.
     */
    public User createUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email '" + user.getEmail() + "' is already registered.");
        }
        user.setRegisteredAt(LocalDateTime.now());
        // Remember to hash passwords in a real application before saving
        return userRepository.save(user);
    }
}