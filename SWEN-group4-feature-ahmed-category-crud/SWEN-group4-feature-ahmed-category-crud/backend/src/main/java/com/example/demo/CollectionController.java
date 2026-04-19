package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/collection")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class CollectionController {

    private final AppService appService;

    public CollectionController(AppService appService) {
        this.appService = appService;
    }

    @GetMapping
    public ResponseEntity<?> getCollection() {
        return ResponseEntity.ok(appService.getCollection());
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCollection(@RequestBody Item item) {
        List<Item> updated = appService.addToCollection(item);
        return ResponseEntity.ok(Map.of(
            "message", "Item added to collection",
            "collection", updated
        ));
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<?> removeFromCollection(@PathVariable String id) {
        boolean removed = appService.removeFromCollection(id);
        if (!removed) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Item not found"));
        }
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Item removed from collection"
        ));
    }
}