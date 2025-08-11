package com.mesh.model;

import java.time.LocalDateTime;
import java.util.UUID;

public class Material {
    public enum MaterialType {TEXT, FILE}

    private String id = UUID.randomUUID().toString();
    private String title;
    private MaterialType type;
    private String textContent; // For text-only materials
    private String fileUrl;     // For uploaded files
    private LocalDateTime uploadedAt = LocalDateTime.now();

    // Getters & Setters...
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public MaterialType getType() {
        return type;
    }

    public void setType(MaterialType type) {
        this.type = type;
    }

    public String getTextContent() {
        return textContent;
    }

    public void setTextContent(String textContent) {
        this.textContent = textContent;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}