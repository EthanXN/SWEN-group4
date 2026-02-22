package com.example.demo;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/items")
@CrossOrigin // allows frontend to connect
public class ItemController {

    private final ItemRepository repo;

    public ItemController(ItemRepository repo) {
        this.repo = repo;
    }

    // GET all items
    @GetMapping
    public List<Item> getAllItems() {
        return repo.findAll();
    }

    // POST new item
    @PostMapping
    public Item addItem(@RequestBody Item item) {
        return repo.save(item);
    }
}