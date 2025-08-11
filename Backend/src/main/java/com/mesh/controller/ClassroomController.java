package com.mesh.controller;

import com.mesh.model.*;
import com.mesh.service.ClassroomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;

@RestController
@RequestMapping("/api/classrooms")
public class ClassroomController {

    @Autowired
    private ClassroomService classroomService;

    @PostMapping("/create")
    public ResponseEntity<Classroom> createClassroom(@RequestBody Classroom classroom, Principal principal) {
        // 'Principal' gives us the currently logged-in user's identity (their email in our case)
        String facultyEmail = principal.getName();
        Classroom createdClassroom = classroomService.createClassroom(classroom, facultyEmail);
        return new ResponseEntity<>(createdClassroom, HttpStatus.CREATED);
    }

    @PostMapping("/{classroomId}/sections")
    public ResponseEntity<Classroom> addSection(
            @PathVariable String classroomId,
            @RequestBody Section section,
            Principal principal) {
        Classroom updatedClassroom = classroomService.addSection(classroomId, section, principal.getName());
        return ResponseEntity.ok(updatedClassroom);
    }

    @PostMapping("/{classroomId}/assignments")
    public ResponseEntity<Classroom> createAssignment(
            @PathVariable String classroomId,
            @RequestBody Assignment assignment,
            Principal principal) {
        Classroom updatedClassroom = classroomService.createAssignment(classroomId, assignment, principal.getName());
        return ResponseEntity.ok(updatedClassroom);
    }

    @PostMapping(value = "/{classroomId}/sections/{sectionId}/materials", consumes = {"multipart/form-data"})
    public ResponseEntity<Classroom> addMaterial(
            @PathVariable String classroomId,
            @PathVariable String sectionId,
            @RequestParam String title,
            @RequestParam(required = false) String textContent, // Optional text content
            @RequestParam(required = false) MultipartFile file, // Optional file upload
            Principal principal) throws IOException {

        Material material = new Material();
        material.setTitle(title);
        material.setTextContent(textContent);

        Classroom updatedClassroom = classroomService.addMaterialToSection(classroomId, sectionId, material, file, principal.getName());
        return ResponseEntity.ok(updatedClassroom);
    }

    @PostMapping("/{classroomId}/assignments/{assignmentId}/submit")
    public ResponseEntity<Classroom> submitAssignment(
            @PathVariable String classroomId,
            @PathVariable String assignmentId,
            @RequestParam("file") MultipartFile file,
            Principal principal) throws IOException {

        Classroom updatedClassroom = classroomService.submitAssignment(classroomId, assignmentId, file, principal.getName());
        return ResponseEntity.ok(updatedClassroom);
    }
}