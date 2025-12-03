# Gridscope-api

A lightweight API built for the Gridscope application.  Its purpose is to provide a simple, clear example of how to design and use a RESTful API while demonstrating the core REST principles in practice. The following demonstration of the REST princples is partly written with the help from ChatGPT 5.1.


<img width="900" height="600" alt="What-is-REST" src="https://github.com/user-attachments/assets/7e9c326f-449a-46bd-8955-846e31371023" />


### 1. Client–Server Separation  
REST separates user interface from data storage and logic.  
The Angular app runs on a seperate port, while the API only exposes data on `/api/components` and `/api/history`, keeping both sides independent.

### 2. Statelessness  
Each request must contain everything needed, and the server should not store client-specific state.  
The API keeps no sessions and reads everything from the request itself (e.g., `req.params.id` in `/api/components/:id`).

### 3. Cacheability  
REST responses should declare whether they can be cached.  
The API does **not** include `Cache-Control` or `ETag` headers, so this is the one principle it does not currently satisfy.

### 4. Uniform Interface  
Resources must have consistent URLs and use correct HTTP methods.  
We use nouns for resources and standard verbs: `GET /api/components`, `POST /api/components`, `PUT /api/components/:id`, `DELETE /api/components/:id`.

### 5. Layered System  
The client should not care if it talks to the server directly or through intermediaries.  
The API uses plain HTTP with no assumptions about direct connection, so it can run behind proxies or load balancers without changes.

### 6. Code on Demand (Optional)  
Servers may send executable code to clients, but this is optional. 
