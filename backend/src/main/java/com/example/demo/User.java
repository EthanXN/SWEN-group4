package com.example.demo;

import java.util.ArrayList;
import java.util.List;

/**
 * In-memory user model (not persisted via JPA). Collection holds item IDs from the catalog.
 */
public class User {

    private Long id;
    private String username;
    private String password;
    private Role role;
    /** Item IDs referencing persisted {@link Item} rows */
    private List<Long> collection = new ArrayList<>();

    public User() {}

    public User(String id, String username, String password, String role) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
    }

    public User(Long id, String username, String password, Role role) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public List<Long> getCollection() {
        return collection;
    }

    public void setCollection(List<Long> collection) {
        this.collection = collection != null ? collection : new ArrayList<>();
    }

    public enum Role {
        OWNER,
        HELPER
    }
}
