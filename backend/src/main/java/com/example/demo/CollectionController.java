package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController // Marks this class as a REST API controller
@RequestMapping("/collection") // Base URL for all endpoints in this controller
@CrossOrigin(origins = "http://localhost:4200") // Allows frontend (React) to call backend
public class CollectionController {

    private final CollectionService collectionService;

    // Constructor injection of CollectionService
    public CollectionController(CollectionService collectionService) {
        this.collectionService = collectionService;
    }

    // READ: Get all collection items
    // Endpoint: GET /collection
    @GetMapping
    public ResponseEntity<List<Collection>> getAllCollections() {
        return ResponseEntity.ok(collectionService.findAllCollections());
    }

    // READ: Get a specific collection item by ID
    // Endpoint: GET /collection/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getCollectionById(@PathVariable String id) {
        Collection collection = collectionService.findCollectionById(id);

        // If item not found, return 404 error
        if (collection == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Collection item not found"));
        }

        return ResponseEntity.ok(collection);
    }

    // CREATE: Add item to collection
    // Endpoint: POST /collection/add
    @PostMapping("/add")
    public ResponseEntity<?> addCollection(@RequestBody Collection collection) {

        // Basic validation
        if (collection.getUserId() == null || collection.getUserId().isBlank()
                || collection.getItemId() == null || collection.getItemId().isBlank()
                || collection.getQuantity() <= 0) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "userId, itemId, and quantity are required"));
        }

        // Save the new collection item using service
        Collection saved = collectionService.saveCollection(collection);

        // Return created object with status 201
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // UPDATE: Update existing collection item
    // Endpoint: PUT /collection/{id}/update
    @PutMapping("/{id}/update")
    public ResponseEntity<?> updateCollection(@PathVariable String id, @RequestBody Collection collection) {

        Collection updated = collectionService.updateCollection(id, collection);

        // If item not found
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Collection item not found"));
        }

        return ResponseEntity.ok(updated);
    }

    // DELETE: Remove item from collection
    // Endpoint: DELETE /collection/{id}/delete
    @DeleteMapping("/{id}/delete")
    public ResponseEntity<?> deleteCollection(@PathVariable String id) {

        boolean deleted = collectionService.deleteCollection(id);

        // If item not found
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Collection item not found"));
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Collection item deleted successfully"
        ));
    }

    // RELATIONSHIP: Get all items for a specific user
    // Endpoint: GET /collection/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Collection>> getCollectionByUserId(@PathVariable String userId) {

        // This simulates the relationship between User and Collection using userId
        return ResponseEntity.ok(collectionService.getCollectionByUserId(userId));
    }
}