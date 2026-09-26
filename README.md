# Mini Admin Dashboard

## Getting Started

### Prerequisites

- Git
- Docker with the Docker Compose plugin

Node.js is not required to run the app with Docker Compose. It is only needed if you want to run the frontend or backend directly on your machine.

### Run with Docker Compose

Clone the repository and enter the project directory:

```sh
git clone https://github.com/sergeongit/dashboard.git
cd dashboard
```

Build and start the frontend and backend:

```sh
docker compose up --build
```

Open the [frontend](http://localhost:8080). The backend is available at `http://localhost:4000`. Database state is stored in `backend/db.json` and persists across container restarts. To stop the services, run `docker compose down`.

## Features

- The header displays the current date and time and the number of active connections (open tabs).
- Navigate between the **Orders** and **Products** pages via routing.
- **Products**: browse product details, including price and warranty, and filter the list by type. Each product's `order` field links it to an order.
- **Orders**: browse orders with product counts and totals, and view an order's details and associated products.
- Deleting an order requires confirmation and also deletes all associated products.

## Tech Stack

- Frontend: Vue 3, TypeScript, Vue Router, Vuex, Bootstrap 5, and scoped CSS.
- Backend: Node.js, TypeScript, and an Express REST API.
- Active connection count updates: Socket.IO.
- Data storage: the `backend/db.json` JSON file.

## API

- `GET /api/health` — check backend health.
- `GET /api/orders` — list orders with their associated products.
- `DELETE /api/orders/:id` — delete an order and its products.
- `GET /api/products` — list products.