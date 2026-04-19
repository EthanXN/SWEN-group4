package com.example.demo;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppService {

    // ArrayLists for each entity
    private List<Item> items = new ArrayList<>();
    private List<User> users = new ArrayList<>();
    private List<Category> categories = new ArrayList<>();

    // Seed data on startup
    public AppService() {

        // Seed Categories
        categories.add(new Category("1", "Desserts", "Sweet treats"));
        categories.add(new Category("2", "Main Course", "Main dishes"));
        categories.add(new Category("3", "Beverages", "Drinks"));
        categories.add(new Category("4", "Appetizers", "Starters"));
        categories.add(new Category("5", "Sides", "Side dishes"));

        // Seed Items
        items.add(new Item("1", "Cheesecake", "Yummy cheese cake", 50.0, "Desserts", "1"));
        items.add(new Item("2", "Pasta", "Classic Italian pasta", 80.0, "Main Course", "2"));
        items.add(new Item("3", "Mocha", "Refreshing coffee", 28.0, "Beverages", "3"));
        items.add(new Item("4", "Greek Salad", "Healthy fresh salad", 40.0, "Appetizers", "4"));
        items.add(new Item("5", "Burger", "Juicy beef burger", 65.0, "Main Course", "2"));
        items.add(new Item("6", "Orange Juice", "Freshly squeezed", 20.0, "Beverages", "3"));
        items.add(new Item("7", "Tiramisu", "Italian dessert", 45.0, "Desserts", "1"));
        items.add(new Item("8", "Spring Rolls", "Crispy appetizer", 35.0, "Appetizers", "4"));
        items.add(new Item("9", "Caesar Salad", "Classic caesar", 38.0, "Appetizers", "4"));
        items.add(new Item("10", "French Fries", "Crispy golden fries", 25.0, "Sides", "5"));

        // Seed Users
        users.add(new User("1", "admin", "admin", "OWNER"));
        users.add(new User("2", "dev", "dev", "OWNER"));
        users.add(new User("3", "helper", "helper", "HELPER"));
        users.add(new User("4", "alice", "password123", "HELPER"));
        users.add(new User("5", "bob", "password123", "HELPER"));
    }

    // ===== CATEGORY CRUD (Ahmed) =====

    public List<Category> getAllCategories() {
        return categories;
    }

    public Category getCategoryById(String id) {
        return categories.stream()
                .filter(c -> c.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public Category saveCategory(Category category) {
        String newId = String.valueOf(categories.size() + 1);
        category.setId(newId);
        categories.add(category);
        return category;
    }

    public Category updateCategory(String id, Category updated) {
        for (int i = 0; i < categories.size(); i++) {
            if (categories.get(i).getId().equals(id)) {
                updated.setId(id);
                categories.set(i, updated);
                return updated;
            }
        }
        return null;
    }

    public boolean deleteCategory(String id) {
        return categories.removeIf(c -> c.getId().equals(id));
    }

    // Relationship: get items by categoryId
    public List<Item> getItemsByCategoryId(String categoryId) {
        return items.stream()
                .filter(i -> i.getCategoryId().equals(categoryId))
                .collect(Collectors.toList());
    }

    // ===== ITEM CRUD (Ethan) =====

    public List<Item> getAllItems() {
        return items;
    }

    public Item getItemById(String id) {
        return items.stream()
                .filter(i -> i.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public Item saveItem(Item item) {
        String newId = String.valueOf(items.size() + 1);
        item.setId(newId);
        items.add(item);
        return item;
    }

    public Item updateItem(String id, Item updated) {
        for (int i = 0; i < items.size(); i++) {
            if (items.get(i).getId().equals(id)) {
                updated.setId(id);
                items.set(i, updated);
                return updated;
            }
        }
        return null;
    }

    public boolean deleteItem(String id) {
        return items.removeIf(i -> i.getId().equals(id));
    }

    public List<Item> searchItemsByName(String name) {
        return items.stream()
                .filter(i -> i.getName().toLowerCase().contains(name.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Item> searchItemsByCategory(String category) {
        return items.stream()
                .filter(i -> i.getCategory().equalsIgnoreCase(category))
                .collect(Collectors.toList());
    }

    // ===== USER CRUD (Hassan) =====

    public List<User> getAllUsers() { return users; }

    public User getUserById(String id) {
        return users.stream()
                .filter(u -> u.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public User saveUser(User user) {
        String newId = String.valueOf(users.size() + 1);
        user.setId(newId);
        users.add(user);
        return user;
    }

    public User updateUser(String id, User updated) {
        for (int i = 0; i < users.size(); i++) {
            if (users.get(i).getId().equals(id)) {
                updated.setId(id);
                users.set(i, updated);
                return updated;
            }
        }
        return null;
    }

    public boolean deleteUser(String id) {
        return users.removeIf(u -> u.getId().equals(id));
    }
}
