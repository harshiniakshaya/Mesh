package com.mesh.controller;

import com.mesh.model.User;
import com.mesh.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    /**
     * Endpoint for an admin to add a single new user (student, faculty, or another admin).
     */
    @PostMapping("/users/add")
    public ResponseEntity<?> addUser(@RequestBody User newUser) {
        try {
            User createdUser = adminService.createUser(newUser);
            return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}