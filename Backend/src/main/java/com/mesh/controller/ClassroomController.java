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
import java.util.List;

@RestController
@RequestMapping("/api/faculty/classrooms") // Changed to be more specific to faculty
public class ClassroomController {

    @Autowired private ClassroomService classroomService;

    // --- Classroom Endpoints ---
    @PostMapping("/create")
    public ResponseEntity<Classroom> createClassroom(@RequestBody Classroom classroom, Principal principal) {
        Classroom createdClassroom = classroomService.createClassroom(classroom, principal.getName());
        return new ResponseEntity<>(createdClassroom, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Classroom>> getMyClassrooms(Principal principal) {
        List<Classroom> classrooms = classroomService.findClassroomsByFaculty(principal.getName());
        return ResponseEntity.ok(classrooms);
    }

    @PutMapping("/{classroomId}")
    public ResponseEntity<Classroom> updateClassroom(@PathVariable String classroomId, @RequestBody Classroom classroomDetails, Principal principal) {
        Classroom updatedClassroom = classroomService.updateClassroom(classroomId, classroomDetails, principal.getName());
        return ResponseEntity.ok(updatedClassroom);
    }

    @DeleteMapping("/{classroomId}")
    public ResponseEntity<Void> deleteClassroom(@PathVariable String classroomId, Principal principal) {
        classroomService.deleteClassroom(classroomId, principal.getName());
        return ResponseEntity.noContent().build();
    }

    // --- Section Endpoints ---
    @PostMapping("/{classroomId}/sections")
    public ResponseEntity<Classroom> addSection(@PathVariable String classroomId, @RequestBody Section section, Principal principal) {
        Classroom updatedClassroom = classroomService.addSection(classroomId, section, principal.getName());
        return ResponseEntity.ok(updatedClassroom);
    }

    @DeleteMapping("/{classroomId}/sections/{sectionId}")
    public ResponseEntity<Classroom> deleteSection(@PathVariable String classroomId, @PathVariable String sectionId, Principal principal) {
        Classroom updatedClassroom = classroomService.deleteSection(classroomId, sectionId, principal.getName());
        return ResponseEntity.ok(updatedClassroom);
    }

    // --- Material Endpoints ---
    @PostMapping(value = "/{classroomId}/sections/{sectionId}/materials", consumes = {"multipart/form-data"})
    public ResponseEntity<Classroom> addMaterial(@PathVariable String classroomId, @PathVariable String sectionId, @RequestParam String title, @RequestParam(required = false) String textContent, @RequestParam(required = false) MultipartFile file, Principal principal) throws IOException {
        Material material = new Material();
        material.setTitle(title);
        material.setTextContent(textContent);
        Classroom updatedClassroom = classroomService.addMaterialToSection(classroomId, sectionId, material, file, principal.getName());
        return ResponseEntity.ok(updatedClassroom);
    }

    @DeleteMapping("/{classroomId}/sections/{sectionId}/materials/{materialId}")
    public ResponseEntity<Classroom> deleteMaterial(@PathVariable String classroomId, @PathVariable String sectionId, @PathVariable String materialId, Principal principal) {
        Classroom updatedClassroom = classroomService.deleteMaterial(classroomId, sectionId, materialId, principal.getName());
        return ResponseEntity.ok(updatedClassroom);
    }

    // --- Assignment Endpoints ---
    @PostMapping("/{classroomId}/assignments")
    public ResponseEntity<Classroom> createAssignment(@PathVariable String classroomId, @RequestBody Assignment assignment, Principal principal) {
        Classroom updatedClassroom = classroomService.createAssignment(classroomId, assignment, principal.getName());
        return ResponseEntity.ok(updatedClassroom);
    }

    @PutMapping("/{classroomId}/assignments/{assignmentId}")
    public ResponseEntity<Classroom> updateAssignment(@PathVariable String classroomId, @PathVariable String assignmentId, @RequestBody Assignment assignmentDetails, Principal principal) {
        Classroom updatedClassroom = classroomService.updateAssignment(classroomId, assignmentId, assignmentDetails, principal.getName());
        return ResponseEntity.ok(updatedClassroom);
    }

    @DeleteMapping("/{classroomId}/assignments/{assignmentId}")
    public ResponseEntity<Classroom> deleteAssignment(@PathVariable String classroomId, @PathVariable String assignmentId, Principal principal) {
        Classroom updatedClassroom = classroomService.deleteAssignment(classroomId, assignmentId, principal.getName());
        return ResponseEntity.ok(updatedClassroom);
    }
}
