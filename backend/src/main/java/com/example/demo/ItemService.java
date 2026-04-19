package com.example.demo;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemService {

    private List<Item> items = new ArrayList<>();
    private List<Item> collection = new ArrayList<>();

    public ItemService() {
        items.add(new Item("Cheesecake", "Yummy cheese cake", 50.0, "Desserts"));
        items.add(new Item("Pasta", "Classic Italian pasta", 80.0, "Main Course"));
        items.add(new Item("Mocha", "Refreshing coffee", 28.0, "Beverages"));
        items.add(new Item("Greek Salad", "Healthy fresh salad", 40.0, "Appetizers"));
        items.add(new Item("Burger", "Juicy beef burger", 65.0, "Main Course"));
        items.add(new Item("Orange Juice", "Freshly squeezed", 20.0, "Beverages"));
        items.add(new Item("Tiramisu", "Italian dessert", 45.0, "Desserts"));
        items.add(new Item("Spring Rolls", "Crispy appetizer", 35.0, "Appetizers"));
        items.add(new Item("Caesar Salad", "Classic caesar", 38.0, "Appetizers"));
        items.add(new Item("French Fries", "Crispy golden fries", 25.0, "Sides"));
    }

    // Save a new item
    public Item save(Item item) {
        items.add(item);
        return item;
    }

    // Search by Name (case-insensitive)
    public List<Item> searchByName(String name) {
        return items.stream()
                .filter(i -> i.getName().toLowerCase().contains(name.toLowerCase()))
                .collect(Collectors.toList());
    }

    // Search by Category (case-insensitive)
    public List<Item> searchByCategory(String category) {
        return items.stream()
                .filter(i -> i.getCategory().equalsIgnoreCase(category))
                .collect(Collectors.toList());
    }

    // Add item to user collection
    public List<Item> addToCollection(Item item) {
        collection.add(item);
        return collection;
    }

    // Get all items
    public List<Item> getAllItems() {
        return items;
    }

    // Get collection
    public List<Item> getCollection() {
        return collection;
    }
}
