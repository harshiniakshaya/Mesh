package com.mesh.repository;

import com.mesh.model.Classroom;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ClassroomRepository extends MongoRepository<Classroom, String> {

    Optional<Classroom> findByClassroomCode(String classroomCode);

    List<Classroom> findByStudentIdsContains(String studentId);

    List<Classroom> findByFacultyId(String facultyId);
}