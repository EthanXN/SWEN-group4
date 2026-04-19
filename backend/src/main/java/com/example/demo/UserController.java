package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<?> listUsers(HttpSession session) {
        if (isUnauthorized(session)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not logged in"));
        }
        if (!isOwner(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only Owner can list users"));
        }
        List<UserResponse> body = userService.getAllUsers().stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(body);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id, HttpSession session) {
        if (isUnauthorized(session)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not logged in"));
        }
        if (!isOwner(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only Owner can view users"));
        }
        return userService.getUserById(id)
                .<ResponseEntity<?>>map(u -> ResponseEntity.ok(toResponse(u)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found")));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addUser(@RequestBody UserUpsertRequest request, HttpSession session) {
        if (isUnauthorized(session)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not logged in"));
        }
        if (!isOwner(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only Owner can create users"));
        }
        if (request == null || request.username() == null || request.username().isBlank()
                || request.password() == null || request.password().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Username and password are required"));
        }
        if (userService.existsByUsername(request.username())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Username already taken"));
        }
        User.Role role = request.role() != null ? request.role() : User.Role.HELPER;
        User created = userService.saveUser(new User(request.username().trim(), request.password(), role));
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(created));
    }

    @PutMapping("/{id}/update")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody UserUpsertRequest request,
            HttpSession session) {
        if (isUnauthorized(session)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not logged in"));
        }
        if (!isOwner(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only Owner can update users"));
        }
        if (request == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Request body is required"));
        }
        if (request.username() != null && !request.username().isBlank()) {
            if (userService.existsByUsernameExcluding(request.username().trim(), id)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "Username already taken"));
            }
        }
        User patch = new User();
        if (request.username() != null) {
            patch.setUsername(request.username().trim());
        }
        if (request.password() != null) {
            patch.setPassword(request.password());
        }
        if (request.role() != null) {
            patch.setRole(request.role());
        }
        return userService.updateUser(id, patch)
                .<ResponseEntity<?>>map(u -> ResponseEntity.ok(toResponse(u)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found")));
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, HttpSession session) {
        if (isUnauthorized(session)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not logged in"));
        }
        if (!isOwner(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only Owner can delete users"));
        }
        boolean removed = userService.deleteUser(id);
        if (!removed) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    private UserResponse toResponse(User u) {
        List<Long> coll = u.getCollection() != null
                ? new ArrayList<>(u.getCollection())
                : new ArrayList<>();
        return new UserResponse(u.getId(), u.getUsername(), u.getRole(), coll);
    }

    private boolean isUnauthorized(HttpSession session) {
        return session.getAttribute("userId") == null;
    }

    private boolean isOwner(HttpSession session) {
        User.Role role = (User.Role) session.getAttribute("role");
        return role == User.Role.OWNER;
    }

    public record UserResponse(Long id, String username, User.Role role, List<Long> collection) {}

    public record UserUpsertRequest(String username, String password, User.Role role) {}
}
