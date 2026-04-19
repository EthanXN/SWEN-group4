# FreshBite — Food & Beverage Ordering System

## Team Members
- Ethan Nagooroo (ID: 386004980)
- Ahmed Shabana (ID: 772003600)
- Abderrahmane Hamidi (ID: 767000039)
- Hassan Al Hasani (ID: 784003677)
- Faisal AlAhmad (ID: 745003693)

## Assignment 3 Progress

### Completed User Stories:
1. US-A3-01: Category CRUD (Add/Edit/Delete) — Ahmed Shabana
   - Branch: feature/ahmed-category-crud
2. US-A3-02: Item CRUD (Add/Edit/Delete) — Ethan Nagooroo
   - Branch: feature/ethan-item-crud
3. US-A3-03: Collection Management CRUD — Abderrahmane Hamidi
   - Branch: feature/abderrahmane-collection-mgmt
4. US-A3-04: User Management CRUD — Hassan Al Hasani
   - Branch: feature/hassan-user-crud
5. US-A3-05: Landing Page + Service Layer + Tests — Faisal AlAhmad
   - Branch: feature/faisal-landing-tests

### Individual Contributions — Assignment 3:
| Student | Entity | Branch | Tasks |
|---|---|---|---|
| Ahmed Shabana | Categories | feature/ahmed-category-crud | Category.java, CategoryController.java, AppService.java, CategoriesPage.tsx, CategoryServiceTest.java |
| Ethan Nagooroo | Items | feature/ethan-item-crud | Item.java (POJO), ItemController.java (full CRUD), Items table + form view |
| Abderrahmane Hamidi | Collection | feature/abderrahmane-collection-mgmt | Collection.java, CollectionController.java, Collection table + form view |
| Hassan Al Hasani | Users | feature/hassan-user-crud | User.java (POJO), UserController.java, Users table + form view |
| Faisal AlAhmad | Service + Landing | feature/faisal-landing-tests | AppService.java seeding, Landing page, Unit tests |

### Architecture Changes (Assignment 3):
- Removed all JPA/database annotations from model classes (pure POJOs)
- All data managed via AppService using ArrayList (in-memory storage)
- Full CRUD REST API implemented for all entities
- New URL patterns: POST /add, PUT /{id}/update, DELETE /{id}/delete
- React frontend with table view and form view per entity
- Unit tests added for service layer (CategoryServiceTest.java)

## Assignment 1 Progress

### Completed:
- [x] Domain Analysis & Class Diagram
- [x] Glossary of Terms
- [x] Functional Requirements Document
- [x] Traceability Matrix
- [x] User Stories Definition (Total: 13 stories)
- [x] Sprint Implementation (4 stories completed)

### Sprint 1 Details:
**Sprint Goal:** Implement secure authentication, role-based access control, and catalog browsing

**Duration:** February 23 to March 8, 2026

**Completed Stories:**
1. US-AUTH-01: Email/Password Login
2. US-AUTH-02: Role-Based Access (Owner vs Helper)
3. US-AUTH-03: Owner Secure Login
4. US-CAT-01: Browse Catalog by Category

# Assignment 2

## Team Members
- Ethan Nagooroo (ID: 386004980)
- Ahmed Shabana (ID: 772003600)
- Abderrahmane Hamidi (ID: 767000039)
- Hassan Al Hasani (ID: 784003677)
- Faisal AlAhmad (ID: 745003693)

## Assignment 2 Progress

### Completed:
- [x] Domain Analysis & Class Diagram
- [x] Glossary of Terms
- [x] Functional Requirements Document
- [x] Traceability Matrix
- [x] User Stories Definition (Total: 10 stories)

### Sprint 2 Details:
**Sprint Goal:** Implement secure authentication, role-based access control, and catalog browsing

**Stories Completed:**
  
  US-AUTH-01 (Role-Based Access): Crucial for showing Owner vs. Helper logic.
  
  US-AUTH-02 (Owner Secure Login): Proves the "admin" account works as required.
  
  US-CAT-01 (Browse by Category): Maps to "View entire Catalog".
  
  US-CAT-02 (Search by Keyword): Maps to "Search or filter Entries".
  
  US-COLL-01 (Add Item to Basket): Maps to "Add Entry to personal Collection".
  
  US-COLL-02 (Persistent Basket): Maps to the "Persistence" requirement after logout.
  
  US-CATM-01 (Add New Menu Item): Maps to "Add new Entry" for Owners.
  
  US-CATM-02 (Edit Existing Item): Maps to "Edit existing Entry data".
  
  US-CATM-03 (Delete Item): Maps to "Delete Entry".
  
  US-SEC-01 (Owner Cannot See Baskets): Directly maps to the specific privacy rule for Owners.

**Duration:** February 1 to February 25, 2026

## Links
- **Trello Board:** https://trello.com/b/5a4Ws4pV/phase-1
- **Functional Requirements:**https://docs.google.com/document/d/1j2Tffo4wU7_lir36_b0EBkcToOFHgi3oqU_lQTD63vc/edit?usp=sharing
- **Traceability Matrix:** https://docs.google.com/spreadsheets/d/1TgXDOXwDY5_ZRXY7AxYGBweRmCqr-XER9K5d6YUTLHs/edit?usp=sharing






