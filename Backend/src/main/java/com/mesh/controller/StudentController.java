package com.mesh.controller;

import com.mesh.model.Classroom;
import com.mesh.service.ClassroomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private ClassroomService classroomService;

    @PostMapping("/classrooms/join")
    public ResponseEntity<Classroom> joinClassroom(@RequestBody Map<String, String> payload, Principal principal) {
        String classroomCode = payload.get("classroomCode");
        Classroom classroom = classroomService.joinClassroom(classroomCode, principal.getName());
        return ResponseEntity.ok(classroom);
    }

    @GetMapping("/classrooms")
    public ResponseEntity<List<Classroom>> getMyClassrooms(Principal principal) {
        List<Classroom> classrooms = classroomService.findClassroomsByStudent(principal.getName());
        return ResponseEntity.ok(classrooms);
    }
}