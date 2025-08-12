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
import java.util.List;

@Service
public class ClassroomService {

    @Autowired private ClassroomRepository classroomRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private AzureBlobService azureBlobService;

    private static final String CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    // Helper method to find a classroom and verify the logged-in faculty is the owner
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

    // --- Faculty: Classroom CRUD ---
    public Classroom createClassroom(Classroom classroom, String facultyEmail) {
        User faculty = userRepository.findByEmail(facultyEmail)
                .orElseThrow(() -> new IllegalArgumentException("Faculty user not found."));
        classroom.setFacultyId(faculty.getId());
        classroom.setFacultyName(faculty.getName());
        classroom.setCreatedAt(LocalDateTime.now());
        classroom.setClassroomCode(generateUniqueCode());
        return classroomRepository.save(classroom);
    }

    public List<Classroom> findClassroomsByFaculty(String facultyEmail) {
        User faculty = userRepository.findByEmail(facultyEmail).orElseThrow();
        return classroomRepository.findByFacultyId(faculty.getId());
    }

    public Classroom updateClassroom(String classroomId, Classroom classroomDetails, String facultyEmail) {
        Classroom classroom = findClassroomAndVerifyFaculty(classroomId, facultyEmail);
        classroom.setClassroomName(classroomDetails.getClassroomName());
        classroom.setSubject(classroomDetails.getSubject());
        return classroomRepository.save(classroom);
    }

    public void deleteClassroom(String classroomId, String facultyEmail) {
        Classroom classroom = findClassroomAndVerifyFaculty(classroomId, facultyEmail);
        // Optional: Add logic here to delete all associated files from Blob Storage
        classroomRepository.delete(classroom);
    }

    // --- Faculty: Section CRUD ---
    public Classroom addSection(String classroomId, Section section, String facultyEmail) {
        Classroom classroom = findClassroomAndVerifyFaculty(classroomId, facultyEmail);
        classroom.getSections().add(section);
        return classroomRepository.save(classroom);
    }

    public Classroom deleteSection(String classroomId, String sectionId, String facultyEmail) {
        Classroom classroom = findClassroomAndVerifyFaculty(classroomId, facultyEmail);
        classroom.getSections().removeIf(s -> s.getId().equals(sectionId));
        return classroomRepository.save(classroom);
    }

    // --- Faculty: Material CRUD ---
    public Classroom addMaterialToSection(String classroomId, String sectionId, Material material, MultipartFile file, String facultyEmail) throws IOException {
        Classroom classroom = findClassroomAndVerifyFaculty(classroomId, facultyEmail);
        Section section = classroom.getSections().stream()
                .filter(s -> s.getId().equals(sectionId)).findFirst()
                .orElseThrow(() -> new RuntimeException("Section not found."));

        if (file != null && !file.isEmpty()) {
            String fileUrl = azureBlobService.uploadFile(file);
            material.setType(Material.MaterialType.FILE);
            material.setFileUrl(fileUrl);
        } else {
            material.setType(Material.MaterialType.TEXT);
        }

        section.getMaterials().add(material);
        return classroomRepository.save(classroom);
    }

    public Classroom deleteMaterial(String classroomId, String sectionId, String materialId, String facultyEmail) {
        Classroom classroom = findClassroomAndVerifyFaculty(classroomId, facultyEmail);
        Section section = classroom.getSections().stream()
                .filter(s -> s.getId().equals(sectionId)).findFirst()
                .orElseThrow(() -> new RuntimeException("Section not found."));

        Material materialToDelete = section.getMaterials().stream()
                .filter(m -> m.getId().equals(materialId)).findFirst()
                .orElse(null);

        if (materialToDelete != null) {
            if (materialToDelete.getType() == Material.MaterialType.FILE && materialToDelete.getFileUrl() != null) {
                azureBlobService.deleteFile(materialToDelete.getFileUrl());
            }
            section.getMaterials().remove(materialToDelete);
        }
        return classroomRepository.save(classroom);
    }

    // --- Faculty: Assignment CRUD ---
    public Classroom createAssignment(String classroomId, Assignment assignment, String facultyEmail) {
        Classroom classroom = findClassroomAndVerifyFaculty(classroomId, facultyEmail);
        classroom.getAssignments().add(assignment);
        return classroomRepository.save(classroom);
    }

    public Classroom updateAssignment(String classroomId, String assignmentId, Assignment assignmentDetails, String facultyEmail) {
        Classroom classroom = findClassroomAndVerifyFaculty(classroomId, facultyEmail);
        Assignment assignmentToUpdate = classroom.getAssignments().stream()
                .filter(a -> a.getId().equals(assignmentId)).findFirst()
                .orElseThrow(() -> new RuntimeException("Assignment not found."));

        assignmentToUpdate.setTitle(assignmentDetails.getTitle());
        assignmentToUpdate.setDescription(assignmentDetails.getDescription());
        assignmentToUpdate.setPoints(assignmentDetails.getPoints());
        assignmentToUpdate.setDueDate(assignmentDetails.getDueDate());
        return classroomRepository.save(classroom);
    }

    public Classroom deleteAssignment(String classroomId, String assignmentId, String facultyEmail) {
        Classroom classroom = findClassroomAndVerifyFaculty(classroomId, facultyEmail);
        classroom.getAssignments().removeIf(a -> a.getId().equals(assignmentId));
        return classroomRepository.save(classroom);
    }

    // --- Student Functionality ---
    public Classroom joinClassroom(String classroomCode, String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student user not found."));
        Classroom classroom = classroomRepository.findByClassroomCode(classroomCode)
                .orElseThrow(() -> new RuntimeException("Classroom with code '" + classroomCode + "' not found."));
        if (!classroom.getStudentIds().contains(student.getId())) {
            classroom.getStudentIds().add(student.getId());
            return classroomRepository.save(classroom);
        }
        return classroom; // Already enrolled
    }

    public List<Classroom> findClassroomsByStudent(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student user not found."));
        return classroomRepository.findByStudentIdsContains(student.getId());
    }

    public Classroom submitAssignment(String classroomId, String assignmentId, MultipartFile file, String studentEmail) throws IOException {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student user not found."));
        Classroom classroom = classroomRepository.findById(classroomId)
                .orElseThrow(() -> new RuntimeException("Classroom not found."));
        if (!classroom.getStudentIds().contains(student.getId())) {
            throw new SecurityException("You are not enrolled in this classroom.");
        }
        Assignment assignment = classroom.getAssignments().stream()
                .filter(a -> a.getId().equals(assignmentId)).findFirst()
                .orElseThrow(() -> new RuntimeException("Assignment not found."));

        String fileUrl = azureBlobService.uploadFile(file);
        Submission newSubmission = new Submission();
        newSubmission.setStudentId(student.getId());
        newSubmission.setStudentName(student.getName());
        newSubmission.setSubmittedFileUrl(fileUrl);

        assignment.getSubmissions().removeIf(sub -> sub.getStudentId().equals(student.getId()));
        assignment.getSubmissions().add(newSubmission);

        return classroomRepository.save(classroom);
    }

    // --- Utility ---
    private String generateUniqueCode() {
        String code;
        do {
            StringBuilder sb = new StringBuilder(6);
            for (int i = 0; i < 6; i++) {
                sb.append(CHARS.charAt(RANDOM.nextInt(CHARS.length())));
            }
            code = sb.toString();
        } while (classroomRepository.findByClassroomCode(code).isPresent());
        return code;
    }
}
