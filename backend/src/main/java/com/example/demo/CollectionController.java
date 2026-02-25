package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/collection")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class CollectionController {

    private final UserRepository userRepo;
    private final ItemRepository itemRepo;

    public CollectionController(UserRepository userRepo, ItemRepository itemRepo) {
        this.userRepo = userRepo;
        this.itemRepo = itemRepo;
    }

    // GET user's collection (HELPER ONLY)
    @GetMapping
    public ResponseEntity<?> getCollection(HttpSession session) {
        if (!isHelper(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only Helpers can access collections"));
        }

        Long userId = (Long) session.getAttribute("userId");
        return userRepo.findById(userId)
                .map(user -> ResponseEntity.ok(user.getCollection()))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // POST add item to collection (HELPER ONLY)
    @PostMapping("/{itemId}")
    public ResponseEntity<?> addToCollection(@PathVariable Long itemId, HttpSession session) {
        if (!isHelper(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only Helpers can manage collections"));
        }

        Long userId = (Long) session.getAttribute("userId");
        
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Item item = itemRepo.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // Check if item already in collection
        if (user.getCollection().contains(item)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Item already in collection"));
        }

        user.getCollection().add(item);
        userRepo.save(user);

        return ResponseEntity.ok(Map.of("message", "Item added to collection", "collection", user.getCollection()));
    }

    // DELETE remove item from collection (HELPER ONLY)
    @DeleteMapping("/{itemId}")
    public ResponseEntity<?> removeFromCollection(@PathVariable Long itemId, HttpSession session) {
        if (!isHelper(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only Helpers can manage collections"));
        }

        Long userId = (Long) session.getAttribute("userId");
        
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Item item = itemRepo.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        user.getCollection().remove(item);
        userRepo.save(user);

        return ResponseEntity.ok(Map.of("message", "Item removed from collection", "collection", user.getCollection()));
    }

    // POST commit collection (HELPER ONLY)
    @PostMapping("/commit")
    public ResponseEntity<?> commitCollection(HttpSession session) {
        if (!isHelper(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only Helpers can commit collections"));
        }

        Long userId = (Long) session.getAttribute("userId");
        
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Item> committedItems = List.copyOf(user.getCollection());
        
        // Clear the collection
        user.getCollection().clear();
        userRepo.save(user);

        // Here you could add logic to update the catalog based on committed items
        // For now, we just clear the collection as per requirements

        return ResponseEntity.ok(Map.of(
            "message", "Collection committed successfully",
            "committedItems", committedItems,
            "collection", user.getCollection()
        ));
    }

    // Helper method for role checking
    private boolean isHelper(HttpSession session) {
        User.Role role = (User.Role) session.getAttribute("role");
        return role == User.Role.HELPER;
    }
}
