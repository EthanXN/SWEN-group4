package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/items")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ItemController {

    private final ItemRepository itemRepo;

    public ItemController(ItemRepository itemRepo) {
        this.itemRepo = itemRepo;
    }

    @GetMapping
    public ResponseEntity<?> getAllItems(HttpSession session) {
        if (!isLoggedIn(session)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not logged in"));
        }
        return ResponseEntity.ok(itemRepo.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getItemById(@PathVariable Long id, HttpSession session) {
        if (!isLoggedIn(session)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not logged in"));
        }
        return itemRepo.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchItems(@RequestParam String query, HttpSession session) {
        if (!isLoggedIn(session)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not logged in"));
        }
        List<Item> results = itemRepo.findByNameContainingIgnoreCase(query);
        return ResponseEntity.ok(results);
    }

    @PostMapping
    public ResponseEntity<?> addItem(@RequestBody Item item, HttpSession session) {
        if (!isOwner(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only Owner can add items"));
        }
        Item saved = itemRepo.save(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateItem(@PathVariable Long id, @RequestBody Item item, HttpSession session) {
        if (!isOwner(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only Owner can update items"));
        }

        return itemRepo.findById(id)
                .map(existingItem -> {
                    existingItem.setName(item.getName());
                    existingItem.setDescription(item.getDescription());
                    existingItem.setPrice(item.getPrice());
                    existingItem.setAvailable(item.isAvailable());
                    existingItem.setCategory(item.getCategory());
                    Item updated = itemRepo.save(existingItem);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE item (OWNER ONLY)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id, HttpSession session) {
        if (!isOwner(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only Owner can delete items"));
        }

        if (!itemRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        itemRepo.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Item deleted successfully"));
    }

    // Helper methods for role checking
    private boolean isLoggedIn(HttpSession session) {
        return session.getAttribute("userId") != null;
    }

    private boolean isOwner(HttpSession session) {
        User.Role role = (User.Role) session.getAttribute("role");
        return role == User.Role.OWNER;
    }
}
