package com.mesh.service;

import com.mesh.model.*;
import com.mesh.repository.ClassroomRepository;
import com.mesh.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class ClassroomService {

    @Autowired
    private ClassroomRepository classroomRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AzureBlobService azureBlobService;

    private static final String CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    public Classroom createClassroom(Classroom classroom, String facultyEmail) {
        // Find the faculty user who is creating the classroom
        User faculty = userRepository.findByEmail(facultyEmail)
                .orElseThrow(() -> new IllegalArgumentException("Faculty user not found."));

        // Set faculty details
        classroom.setFacultyId(faculty.getId());
        classroom.setFacultyName(faculty.getName());
        classroom.setCreatedAt(LocalDateTime.now());

        // Generate and set a unique classroom code
        classroom.setClassroomCode(generateUniqueCode());

        return classroomRepository.save(classroom);
    }

    /**
     * Generates a random 6-character alphanumeric code.
     * It checks the database to ensure the code is unique.
     */
    private String generateUniqueCode() {
        String code;
        do {
            StringBuilder sb = new StringBuilder(6);
            for (int i = 0; i < 6; i++) {
                sb.append(CHARS.charAt(RANDOM.nextInt(CHARS.length())));
            }
            code = sb.toString();
        } while (classroomRepository.findByClassroomCode(code).isPresent()); // Loop until a unique code is found
        return code;
    }

    private Classroom findClassroomAndVerifyFaculty(String classroomId, String facultyEmail) {
        Classroom classroom = classroomRepository.findById(classroomId)
                .orElseThrow(() -> new RuntimeException("Classroom not found with ID: " + classroomId));

        User faculty = userRepository.findByEmail(facultyEmail)
                .orElseThrow(() -> new RuntimeException("Faculty user not found."));

        if (!classroom.getFacultyId().equals(faculty.getId())) {
            throw new SecurityException("You are not authorized to modify this classroom.");
        }
        return classroom;
    }

    public Classroom addSection(String classroomId, Section section, String facultyEmail) {
        Classroom classroom = findClassroomAndVerifyFaculty(classroomId, facultyEmail);
        classroom.getSections().add(section);
        return classroomRepository.save(classroom);
    }

    public Classroom addMaterialToSection(String classroomId, String sectionId, Material material, MultipartFile file, String facultyEmail) throws IOException {
        Classroom classroom = findClassroomAndVerifyFaculty(classroomId, facultyEmail);

        Section section = classroom.getSections().stream()
                .filter(s -> s.getId().equals(sectionId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Section not found with ID: " + sectionId));

        if (file != null && !file.isEmpty()) {
            // It's a file upload
            String fileUrl = azureBlobService.uploadFile(file);
            material.setType(Material.MaterialType.FILE);
            material.setFileUrl(fileUrl);
        } else {
            // It's a text-only material
            material.setType(Material.MaterialType.TEXT);
        }

        section.getMaterials().add(material);
        return classroomRepository.save(classroom);
    }

    public Classroom createAssignment(String classroomId, Assignment assignment, String facultyEmail) {
        Classroom classroom = findClassroomAndVerifyFaculty(classroomId, facultyEmail);
        classroom.getAssignments().add(assignment);
        return classroomRepository.save(classroom);
    }
}