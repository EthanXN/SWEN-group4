package com.example.demo;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CollectionService {

    private final List<Collection> collections = new ArrayList<>();
    private int nextId = 1;

    public CollectionService() {
        seedCollections();
    }

    private void seedCollections() {
        saveCollection(new Collection("1", "1", 2));
        saveCollection(new Collection("1", "2", 1));
        saveCollection(new Collection("2", "3", 4));
        saveCollection(new Collection("2", "1", 1));
        saveCollection(new Collection("3", "4", 2));
    }

    public Collection saveCollection(Collection collection) {
        collection.setId(String.valueOf(nextId++));
        collections.add(collection);
        return collection;
    }

    public List<Collection> findAllCollections() {
        return collections;
    }

    public Collection findCollectionById(String id) {
        for (Collection collection : collections) {
            if (collection.getId().equals(id)) {
                return collection;
            }
        }
        return null;
    }

    public Collection updateCollection(String id, Collection updatedCollection) {
        Collection existing = findCollectionById(id);
        if (existing != null) {
            existing.setUserId(updatedCollection.getUserId());
            existing.setItemId(updatedCollection.getItemId());
            existing.setQuantity(updatedCollection.getQuantity());
        }
        return existing;
    }

    public boolean deleteCollection(String id) {
        Collection existing = findCollectionById(id);
        if (existing != null) {
            collections.remove(existing);
            return true;
        }
        return false;
    }

    public List<Collection> getCollectionByUserId(String userId) {
        List<Collection> result = new ArrayList<>();
        for (Collection collection : collections) {
            if (collection.getUserId().equals(userId)) {
                result.add(collection);
            }
        }
        return result;
    }
}