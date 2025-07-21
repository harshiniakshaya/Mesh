package com.mesh.controller;

import com.mesh.model.User;
import com.mesh.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @PostMapping("/signup")   // Separate endpoint for students
    public String studentSignup(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "Email already registered";
        }

        user.setRole("student");
        user.setRegisteredAt(LocalDateTime.now());
        userRepository.save(user);

        return "Student registered successfully";
    }
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        User existingUser = userRepository.findByEmail(user.getEmail()).orElse(null);

        if (existingUser == null) {
            return "Email not found";
        }

        if (existingUser.getPassword().equals(user.getPassword())) {
            return "Login successful as "+existingUser.getRole();
        } else {
            return "Incorrect password";
        }
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id) {
        userRepository.deleteById(id);
    }
}
