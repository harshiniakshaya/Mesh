package com.mesh.repository;

import com.mesh.model.Classroom;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.*;

public interface ClassroomRepository extends MongoRepository<Classroom, String> {
    // A method to check if a classroom code already exists
    Optional<Classroom> findByClassroomCode(String classroomCode);

    List<Classroom> findByStudentIdsContains(String studentId);
}