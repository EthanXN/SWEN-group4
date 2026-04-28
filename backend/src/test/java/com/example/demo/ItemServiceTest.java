package com.example.demo;

import org.junit.jupiter.api.Test;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

public class ItemServiceTest {

    private final ItemService itemService = new ItemService();

    @Test
    void getAllItems_shouldReturnSeededItems() {
        assertFalse(itemService.getAllItems().isEmpty());
    }

    @Test
    void searchByName_shouldReturnMatchingItems() {
        List<Item> results = itemService.searchByName("cake");
        assertFalse(results.isEmpty());
    }

    @Test
    void searchByCategory_shouldReturnMatchingItems() {
        List<Item> results = itemService.searchByCategory("Desserts");
        assertFalse(results.isEmpty());
    }

    @Test
    void getCollection_shouldNotBeNull() {
        assertNotNull(itemService.getCollection());
    }
}