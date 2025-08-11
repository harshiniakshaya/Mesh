package com.mesh.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Section {
    private String id = UUID.randomUUID().toString(); // Unique ID within the document
    private String title;
    private List<Material> materials = new ArrayList<>();

    // Getters & Setters
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

    public List<Material> getMaterials() {
        return materials;
    }

    public void setMaterials(List<Material> materials) {
        this.materials = materials;
    }
}