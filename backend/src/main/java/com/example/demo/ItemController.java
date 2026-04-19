package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/items")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ItemController {

    private final AppService appService;

    public ItemController(AppService appService) {
        this.appService = appService;
    }

    // GET all items
    @GetMapping
    public ResponseEntity<List<Item>> getAllItems() {
        return ResponseEntity.ok(appService.getAllItems());
    }

    // GET item by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getItemById(@PathVariable Long id) {
        Item item = appService.getItemById(id);
        if (item == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Item not found"));
        }
        return ResponseEntity.ok(item);
    }

    // GET search by name
    @GetMapping("/search")
    public ResponseEntity<List<Item>> searchByName(@RequestParam String query) {
        return ResponseEntity.ok(appService.searchItemsByName(query));
    }

    // GET filter by category
    @GetMapping("/category")
    public ResponseEntity<List<Item>> searchByCategory(@RequestParam String category) {
        return ResponseEntity.ok(appService.searchItemsByCategory(category));
    }

    // POST add new item
    @PostMapping("/add")
    public ResponseEntity<Item> addItem(@RequestBody Item item) {
        Item saved = appService.saveItem(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // PUT update item
    @PutMapping("/{id}/update")
    public ResponseEntity<?> updateItem(@PathVariable Long id,
                                         @RequestBody Item item) {
        Item updated = appService.updateItem(id, item);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Item not found"));
        }
        return ResponseEntity.ok(updated);
    }

    // DELETE item
    @DeleteMapping("/{id}/delete")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        boolean deleted = appService.deleteItem(id);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Item not found"));
        }
        return ResponseEntity.ok(Map.of("success", true,
                                        "message", "Item deleted successfully"));
    }
}