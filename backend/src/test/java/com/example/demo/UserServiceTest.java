package com.example.demo;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class UserServiceTest {

    private UserService userService;

    @BeforeEach
    void setUp() {
        userService = new UserService();
    }

    @Test
    void seededUsersExist() {
        List<User> all = userService.getAllUsers();
        assertEquals(5, all.size());
        assertTrue(userService.getUserById(1L).isPresent());
        assertTrue(userService.findByUsername("admin").isPresent());
        assertTrue(userService.findByUsername("dev").isPresent());
    }

    @Test
    void getUserById_returnsSeededUser() {
        Optional<User> u = userService.getUserById(3L);
        assertTrue(u.isPresent());
        assertEquals("helper1", u.get().getUsername());
        assertEquals(User.Role.HELPER, u.get().getRole());
    }

    @Test
    void getUserById_missing_returnsEmpty() {
        assertTrue(userService.getUserById(999L).isEmpty());
        assertTrue(userService.getUserById(null).isEmpty());
    }

    @Test
    void saveUser_assignsUniqueId() {
        User nu = new User("newbie", "pw", User.Role.HELPER);
        User saved = userService.saveUser(nu);
        assertNotNull(saved.getId());
        assertEquals(6L, saved.getId());
        assertTrue(userService.getUserById(6L).isPresent());
        User second = new User("newbie2", "pw2", User.Role.HELPER);
        assertEquals(7L, userService.saveUser(second).getId());
    }

    @Test
    void updateUser_changesFields_preservesId() {
        Optional<User> updated = userService.updateUser(3L, buildPatch("helper1x", "newpass", User.Role.OWNER));
        assertTrue(updated.isPresent());
        assertEquals(3L, updated.get().getId());
        assertEquals("helper1x", updated.get().getUsername());
        assertEquals("newpass", updated.get().getPassword());
        assertEquals(User.Role.OWNER, updated.get().getRole());
    }

    @Test
    void updateUser_missingId_returnsEmpty() {
        User patch = new User();
        patch.setUsername("ghost");
        assertTrue(userService.updateUser(999L, patch).isEmpty());
    }

    @Test
    void deleteUser_removesUser() {
        assertTrue(userService.deleteUser(5L));
        assertTrue(userService.getUserById(5L).isEmpty());
        assertFalse(userService.deleteUser(5L));
    }

    @Test
    void findByUsername_trimsAndMatches() {
        assertEquals("admin", userService.findByUsername("  admin  ").orElseThrow().getUsername());
    }

    @Test
    void existsByUsername_works() {
        assertTrue(userService.existsByUsername("alice"));
        assertFalse(userService.existsByUsername("no_one"));
    }

    @Test
    void existsByUsernameExcluding_ignoresSameUser() {
        assertFalse(userService.existsByUsernameExcluding("admin", 1L));
        assertTrue(userService.existsByUsernameExcluding("admin", 2L));
    }

    private static User buildPatch(String username, String password, User.Role role) {
        User u = new User();
        u.setUsername(username);
        u.setPassword(password);
        u.setRole(role);
        return u;
    }
}
