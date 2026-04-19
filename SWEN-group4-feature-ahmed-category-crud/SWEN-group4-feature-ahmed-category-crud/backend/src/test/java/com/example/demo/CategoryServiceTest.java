package com.example.demo;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

public class CategoryServiceTest {

    private AppService appService;

    @BeforeEach
    void setUp() {
        appService = new AppService();
    }

    // Test 1 - Get all categories
    @Test
    void testGetAllCategories() {
        List<Category> categories = appService.getAllCategories();
        assertNotNull(categories);
        assertEquals(5, categories.size());
    }

    // Test 2 - Get category by ID
    @Test
    void testGetCategoryById() {
        Category category = appService.getCategoryById("1");
        assertNotNull(category);
        assertEquals("Desserts", category.getName());
    }

    // Test 3 - Save new category
    @Test
    void testSaveCategory() {
        Category newCategory = new Category(null, "Soups", "Hot soups");
        Category saved = appService.saveCategory(newCategory);
        assertNotNull(saved.getId());
        assertEquals("Soups", saved.getName());
        assertEquals(6, appService.getAllCategories().size());
    }

    // Test 4 - Update category
    @Test
    void testUpdateCategory() {
        Category updated = new Category("1", "Sweet Desserts", "Updated description");
        Category result = appService.updateCategory("1", updated);
        assertNotNull(result);
        assertEquals("Sweet Desserts", result.getName());
    }

    // Test 5 - Delete category
    @Test
    void testDeleteCategory() {
        boolean deleted = appService.deleteCategory("1");
        assertTrue(deleted);
        assertEquals(4, appService.getAllCategories().size());
    }

    // Test 6 - Delete non-existing category
    @Test
    void testDeleteNonExistingCategory() {
        boolean deleted = appService.deleteCategory("999");
        assertFalse(deleted);
    }

    // Test 7 - Get items by category ID (relationship test)
    @Test
    void testGetItemsByCategoryId() {
        List<Item> items = appService.getItemsByCategoryId("1");
        assertNotNull(items);
        assertTrue(items.size() > 0);
        items.forEach(item -> assertEquals("1", item.getCategoryId()));
    }

    // Test 8 - Get category by non-existing ID
    @Test
    void testGetCategoryByInvalidId() {
        Category category = appService.getCategoryById("999");
        assertNull(category);
    }
}
