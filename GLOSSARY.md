# GLOSSARY.md

## Domain-Specific Terms

| Term | Definition |
|------|------------|
| **Basket** | A temporary collection of items selected by a Helper before submitting an order. Similar to a shopping cart. |
| **Catalog** | The complete list of food and beverage items available in the system, managed by the Owner. |
| **Item** | A single food or beverage entry in the catalog, with attributes such as name, description, price, category, and availability. |
| **Order** | A finalized and submitted selection of items from a Helper's basket. An order is saved permanently in the system. |
| **Helper** | A user role representing a customer who can browse the catalog, add items to their basket, and place orders. |
| **Owner** | A user role representing the admin who manages the catalog (add, edit, remove items). Cannot place orders. |
| **Category** | A label used to group catalog items (e.g., Beverages, Mains, Desserts). |
| **Availability** | A status flag on a catalog item indicating whether it can currently be added to a basket. |
| **Checkout** | The process where a Helper reviews their basket and submits a final order. |

---

## Technical Terms

| Term | Definition |
|------|------------|
| **Spring Boot** | The Java-based backend framework used to build the REST API and handle business logic. |
| **Angular** | The TypeScript-based frontend framework used to build the user interface. |
| **REST API** | A set of HTTP endpoints that allow the Angular frontend to communicate with the Spring Boot backend. |
| **Controller** | A Spring Boot class annotated with `@RestController` that handles incoming HTTP requests and returns responses. |
| **Service** | A Spring Boot class annotated with `@Service` that contains the business logic of the application. |
| **Repository** | A Spring Boot interface that handles database operations (CRUD) for a specific entity. |
| **Entity** | A Java class mapped to a database table using JPA/Hibernate annotations. |
| **DTO** | Data Transfer Object — a simple object used to carry data between the frontend and backend. |
| **JWT** | JSON Web Token — a token issued after login used to authenticate and authorize subsequent requests. |
| **Authentication** | The process of verifying a user's identity through login credentials. |
| **Authorization** | The process of verifying that an authenticated user has permission to perform a specific action. |
| **JSON** | JavaScript Object Notation — the data format used for communication between the frontend and backend. |
| **HTTP Method** | The type of REST request: GET (retrieve), POST (create), PUT (update), DELETE (remove). |
| **CORS** | Cross-Origin Resource Sharing — a browser security mechanism that must be configured to allow Angular to communicate with the Spring Boot backend. |

---

## Acronyms & Abbreviations

| Acronym | Full Form |
|---------|-----------|
| **API** | Application Programming Interface |
| **CORS** | Cross-Origin Resource Sharing |
| **CRUD** | Create, Read, Update, Delete |
| **DTO** | Data Transfer Object |
| **FRD** | Functional Requirements Document |
| **HTTP** | Hypertext Transfer Protocol |
| **JSON** | JavaScript Object Notation |
| **NFR** | Non-Functional Requirement |
| **UI** | User Interface |
| **URL** | Uniform Resource Locator |
| **US** | User Story |