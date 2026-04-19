package com.example.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepo;
    private final ItemRepository itemRepo;

    public DataInitializer(UserRepository userRepo, ItemRepository itemRepo) {
        this.userRepo = userRepo;
        this.itemRepo = itemRepo;
    }

    @Override
    public void run(String... args) {
        if (userRepo.count() == 0) {
            userRepo.save(new User("admin", "admin", User.Role.OWNER));
            userRepo.save(new User("dev", "dev", User.Role.OWNER));
            userRepo.save(new User("helper", "helper", User.Role.HELPER));
        }

        if (itemRepo.count() == 0) {
            itemRepo.save(new Item("Cheesecake", "Yummy cheese cake", 50.0, "Desserts"));
            itemRepo.save(new Item("Pasta", "Classic Italian pasta", 80.0, "Main Course"));
            itemRepo.save(new Item("Mocha", "Refreshing coffee", 28.0, "Beverages"));
            itemRepo.save(new Item("Greek Salad", "Healthy fresh salad", 40.0, "Appetizers"));
            itemRepo.save(new Item("Burger", "Juicy beef burger", 65.0, "Main Course"));
            itemRepo.save(new Item("Orange Juice", "Freshly squeezed", 20.0, "Beverages"));
            itemRepo.save(new Item("Tiramisu", "Italian dessert", 45.0, "Desserts"));
            itemRepo.save(new Item("Spring Rolls", "Crispy appetizer", 35.0, "Appetizers"));
            itemRepo.save(new Item("Caesar Salad", "Classic caesar", 38.0, "Appetizers"));
            itemRepo.save(new Item("French Fries", "Crispy golden fries", 25.0, "Sides"));
        }
    }
}