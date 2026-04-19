package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/collection")
public class CollectionController {

    private final UserService userService;
    private final ItemRepository itemRepo;

    public CollectionController(UserService userService, ItemRepository itemRepo) {
        this.userService = userService;
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
        return userService.getUserById(userId)
                .map(user -> ResponseEntity.ok(resolveCollectionItems(user)))
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

        User user = userService.getUserById(userId)
                .orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        Item item = itemRepo.findById(itemId).orElse(null);
        if (item == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Item not found"));
        }

        if (user.getCollection().contains(itemId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Item already in collection"));
        }

        user.getCollection().add(itemId);

        return ResponseEntity.ok(Map.of(
                "message", "Item added to collection",
                "collection", resolveCollectionItems(user)));
    }

    // DELETE remove item from collection (HELPER ONLY)
    @DeleteMapping("/{itemId}")
    public ResponseEntity<?> removeFromCollection(@PathVariable Long itemId, HttpSession session) {
        if (!isHelper(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only Helpers can manage collections"));
        }

        Long userId = (Long) session.getAttribute("userId");

        User user = userService.getUserById(userId)
                .orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        Item item = itemRepo.findById(itemId).orElse(null);
        if (item == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Item not found"));
        }

        user.getCollection().remove(itemId);

        return ResponseEntity.ok(Map.of(
                "message", "Item removed from collection",
                "collection", resolveCollectionItems(user)));
    }

    // POST commit collection (HELPER ONLY)
    @PostMapping("/commit")
    public ResponseEntity<?> commitCollection(HttpSession session) {
        if (!isHelper(session)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only Helpers can commit collections"));
        }

        Long userId = (Long) session.getAttribute("userId");

        User user = userService.getUserById(userId)
                .orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        List<Item> committedItems = new ArrayList<>(resolveCollectionItems(user));

        user.getCollection().clear();

        return ResponseEntity.ok(Map.of(
            "message", "Collection committed successfully",
            "committedItems", committedItems,
            "collection", resolveCollectionItems(user)
        ));
    }

    private List<Item> resolveCollectionItems(User user) {
        List<Long> ids = user.getCollection();
        if (ids == null || ids.isEmpty()) {
            return new ArrayList<>();
        }
        List<Item> out = new ArrayList<>();
        for (Long itemId : ids) {
            itemRepo.findById(itemId).ifPresent(out::add);
        }
        return out;
    }

    private boolean isHelper(HttpSession session) {
        User.Role role = (User.Role) session.getAttribute("role");
        return role == User.Role.HELPER;
    }
}
