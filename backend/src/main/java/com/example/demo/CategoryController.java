package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class CategoryController {

    private final AppService appService;

    public CategoryController(AppService appService) {
        this.appService = appService;
    }

    // GET all categories
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(appService.getAllCategories());
    }

    // GET category by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable String id) {
        Category category = appService.getCategoryById(id);
        if (category == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Category not found"));
        }
        return ResponseEntity.ok(category);
    }

    // POST add new category
    @PostMapping("/add")
    public ResponseEntity<Category> addCategory(@RequestBody Category category) {
        Category saved = appService.saveCategory(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // PUT update category
    @PutMapping("/{id}/update")
    public ResponseEntity<?> updateCategory(@PathVariable String id, 
                                             @RequestBody Category category) {
        Category updated = appService.updateCategory(id, category);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Category not found"));
        }
        return ResponseEntity.ok(updated);
    }

    // DELETE category
    @DeleteMapping("/{id}/delete")
    public ResponseEntity<?> deleteCategory(@PathVariable String id) {
        boolean deleted = appService.deleteCategory(id);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Category not found"));
        }
        return ResponseEntity.ok(Map.of("success", true, 
                                        "message", "Category deleted successfully"));
    }

    // GET items by category (relationship)
    @GetMapping("/{id}/items")
    public ResponseEntity<?> getItemsByCategory(@PathVariable String id) {
        return ResponseEntity.ok(appService.getItemsByCategoryId(id));
    }
}
