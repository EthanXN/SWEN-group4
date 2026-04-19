package com.example.demo;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppService {

    private final ItemRepository itemRepo;

    public AppService(ItemRepository itemRepo) {
        this.itemRepo = itemRepo;
    }

    public List<Item> getAllItems() {
        return itemRepo.findAll();
    }

    public Item getItemById(Long id) {
        return itemRepo.findById(id).orElse(null);
    }

    public List<Item> searchItemsByName(String query) {
        return itemRepo.findByNameContainingIgnoreCase(query);
    }

    public List<Item> searchItemsByCategory(String category) {
        return itemRepo.findAll().stream()
                .filter(i -> i.getCategory().equalsIgnoreCase(category))
                .collect(Collectors.toList());
    }

    public Item saveItem(Item item) {
        item.setAvailable(true);
        return itemRepo.save(item);
    }

    public Item updateItem(Long id, Item updated) {
        return itemRepo.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setDescription(updated.getDescription());
            existing.setPrice(updated.getPrice());
            existing.setAvailable(updated.isAvailable());
            existing.setCategory(updated.getCategory());
            return itemRepo.save(existing);
        }).orElse(null);
    }

    public boolean deleteItem(Long id) {
        if (itemRepo.existsById(id)) {
            itemRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
