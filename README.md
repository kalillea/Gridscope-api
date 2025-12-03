# Gridscope-api

A lightweight API built for the Gridscope application.  Its purpose is to provide a simple, clear example of how to design and use a RESTful API while demonstrating the core REST principles in practice.


### 1. Client–Server Separation  
REST separates user interface from data storage and logic.  
Your Angular app runs on port 4200, while the API only exposes data on `/api/components` and `/api/history`, keeping both sides independent.

### 2. Statelessness  
Each request must contain everything needed, and the server should not store client-specific state.  
Your API keeps no sessions and reads everything from the request itself (e.g., `req.params.id` in `/api/components/:id`).

### 3. Cacheability  
REST responses should declare whether they can be cached.  
Your API does **not** include `Cache-Control` or `ETag` headers, so this is the one principle it does not currently satisfy.

### 4. Uniform Interface  
Resources must have consistent URLs and use correct HTTP methods.  
You use nouns for resources and standard verbs: `GET /api/components`, `POST /api/components`, `PUT /api/components/:id`, `DELETE /api/components/:id`.

### 5. Layered System  
The client should not care if it talks to the server directly or through intermediaries.  
Your API uses plain HTTP with no assumptions about direct connection, so it can run behind proxies or load balancers without changes.

### 6. Code on Demand (Optional)  
Servers may send executable code to clients, but this is optional.  
Your API doesn’t use this principle, which is perfectly fine for REST.
