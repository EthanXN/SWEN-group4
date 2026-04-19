package com.example.demo;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class CollectionServiceTest {

    @Test
    void saveCollection_shouldAddCollectionAndAssignId() {
        CollectionService service = new CollectionService();

        Collection collection = new Collection("1", "10", 2);
        Collection saved = service.saveCollection(collection);

        assertNotNull(saved.getId());
        assertEquals("1", saved.getUserId());
        assertEquals("10", saved.getItemId());
        assertEquals(2, saved.getQuantity());
    }

    @Test
    void getCollectionByUserId_shouldReturnOnlyMatchingUserItems() {
        CollectionService service = new CollectionService();

        List<Collection> userCollections = service.getCollectionByUserId("1");

        assertFalse(userCollections.isEmpty());
        assertTrue(userCollections.stream().allMatch(c -> c.getUserId().equals("1")));
    }

    @Test
    void updateCollection_shouldModifyExistingCollection() {
        CollectionService service = new CollectionService();

        Collection newCollection = new Collection("1", "5", 1);
        Collection saved = service.saveCollection(newCollection);

        Collection updatedData = new Collection("1", "5", 7);
        Collection updated = service.updateCollection(saved.getId(), updatedData);

        assertNotNull(updated);
        assertEquals(7, updated.getQuantity());
    }

    @Test
    void deleteCollection_shouldRemoveCollection() {
        CollectionService service = new CollectionService();

        Collection newCollection = new Collection("2", "8", 1);
        Collection saved = service.saveCollection(newCollection);

        boolean deleted = service.deleteCollection(saved.getId());

        assertTrue(deleted);
        assertNull(service.findCollectionById(saved.getId()));
    }
}