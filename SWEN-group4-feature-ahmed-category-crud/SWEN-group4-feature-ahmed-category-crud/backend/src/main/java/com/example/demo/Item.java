package com.example.demo;

public class Item {

    private String id;
    private String name;
    private String description;
    private Double price;
    private boolean available;
    private String category;
    private String categoryId;

    public Item() {}

    public Item(String name) {
        this.name = name;
    }

    public Item(String name, String description, Double price, String category) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.available = true;
    }

    public Item(String id, String name, String description,
                Double price, String category, String categoryId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.available = true;
        this.category = category;
        this.categoryId = categoryId;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }
}