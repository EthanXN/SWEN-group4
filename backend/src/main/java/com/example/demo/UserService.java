package com.example.demo;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class UserService {

    private final List<User> users = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1L);

    public UserService() {
        seedUsers();
    }

    private void seedUsers() {
        addSeededUser(1L, "admin", "admin", User.Role.OWNER);
        addSeededUser(2L, "dev", "dev", User.Role.OWNER);
        addSeededUser(3L, "helper1", "helper1", User.Role.HELPER);
        addSeededUser(4L, "helper2", "helper2", User.Role.HELPER);
        addSeededUser(5L, "alice", "alice", User.Role.HELPER);
        long max = users.stream().mapToLong(User::getId).max().orElse(0L);
        idGenerator.set(max + 1L);
    }

    private void addSeededUser(Long id, String username, String password, User.Role role) {
        User u = new User(id, username, password, role);
        u.setCollection(new ArrayList<>());
        users.add(u);
    }

    public List<User> getAllUsers() {
        return Collections.unmodifiableList(new ArrayList<>(users));
    }

    public Optional<User> getUserById(Long id) {
        if (id == null) {
            return Optional.empty();
        }
        return users.stream().filter(u -> id.equals(u.getId())).findFirst();
    }

    /**
     * Creates a new user; assigns a unique id. Ignores any id set on {@code user}.
     */
    public User saveUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException("user is required");
        }
        long newId = idGenerator.getAndIncrement();
        user.setId(newId);
        if (user.getCollection() == null) {
            user.setCollection(new ArrayList<>());
        } else {
            user.setCollection(new ArrayList<>(user.getCollection()));
        }
        users.add(user);
        return user;
    }

    public Optional<User> updateUser(Long id, User updatedUser) {
        if (id == null || updatedUser == null) {
            return Optional.empty();
        }
        for (int i = 0; i < users.size(); i++) {
            User existing = users.get(i);
            if (id.equals(existing.getId())) {
                if (updatedUser.getUsername() != null && !updatedUser.getUsername().isBlank()) {
                    existing.setUsername(updatedUser.getUsername().trim());
                }
                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                    existing.setPassword(updatedUser.getPassword());
                }
                if (updatedUser.getRole() != null) {
                    existing.setRole(updatedUser.getRole());
                }
                if (updatedUser.getCollection() != null) {
                    existing.setCollection(new ArrayList<>(updatedUser.getCollection()));
                }
                return Optional.of(existing);
            }
        }
        return Optional.empty();
    }

    /**
     * @return true if a user with this id existed and was removed
     */
    public boolean deleteUser(Long id) {
        if (id == null) {
            return false;
        }
        return users.removeIf(u -> id.equals(u.getId()));
    }

    public Optional<User> findByUsername(String username) {
        if (username == null || username.isBlank()) {
            return Optional.empty();
        }
        String key = username.trim();
        return users.stream().filter(u -> key.equals(u.getUsername())).findFirst();
    }

    public boolean existsByUsername(String username) {
        return findByUsername(username).isPresent();
    }

    public boolean existsByUsernameExcluding(String username, Long excludeUserId) {
        if (username == null || username.isBlank() || excludeUserId == null) {
            return false;
        }
        String key = username.trim();
        return users.stream()
                .filter(u -> !excludeUserId.equals(u.getId()))
                .anyMatch(u -> key.equals(u.getUsername()));
    }
}
