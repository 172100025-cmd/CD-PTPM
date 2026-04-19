import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// Health check endpoint
app.get("/make-server-f5317610/health", (c) => {
  return c.json({ status: "ok" });
});

// Seed initial data
app.post("/make-server-f5317610/seed", async (c) => {
  try {
    const initialMenuItems = [
      {
        id: '1',
        name: 'Espresso',
        price: 45000,
        image: 'https://images.unsplash.com/photo-1645445644664-8f44112f334c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3ByZXNzbyUyMGNvZmZlZSUyMGN1cHxlbnwxfHx8fDE3NzY0MTQ4NTh8MA&ixlib=rb-4.1.0&q=80&w=400',
        available: true,
        category: 'Đồ uống',
        order: 0
      },
      {
        id: '2',
        name: 'Cappuccino',
        price: 55000,
        image: 'https://images.unsplash.com/photo-1667388363683-a07bbf0c84b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXBwdWNjaW5vJTIwbGF0dGUlMjBhcnR8ZW58MXx8fHwxNzc2NDMxMjM1fDA&ixlib=rb-4.1.0&q=80&w=400',
        available: true,
        category: 'Đồ uống',
        order: 1
      },
      {
        id: '3',
        name: 'Cà Phê Sữa Đá',
        price: 35000,
        image: 'https://images.unsplash.com/photo-1558722141-76ef6ca013be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwaWNlZCUyMGNvZmZlZXxlbnwxfHx8fDE3NzYzNTYyNjl8MA&ixlib=rb-4.1.0&q=80&w=400',
        available: true,
        category: 'Đồ uống',
        order: 2
      },
      {
        id: '4',
        name: 'Bánh Croissant',
        price: 40000,
        image: 'https://images.unsplash.com/photo-1737700088850-d0b53f9d39ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9pc3NhbnQlMjBwYXN0cnklMjBicmVha2Zhc3R8ZW58MXx8fHwxNzc2NDM1MzY4fDA&ixlib=rb-4.1.0&q=80&w=400',
        available: true,
        category: 'Bánh ngọt',
        order: 3
      },
      {
        id: '5',
        name: 'Bánh Chocolate',
        price: 50000,
        image: 'https://images.unsplash.com/photo-1607257882338-70f7dd2ae344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBjYWtlJTIwZGVzc2VydHxlbnwxfHx8fDE3NzYzODY0MjB8MA&ixlib=rb-4.1.0&q=80&w=400',
        available: false,
        category: 'Bánh ngọt',
        order: 4
      },
      {
        id: '6',
        name: 'Sandwich',
        price: 60000,
        image: 'https://images.unsplash.com/photo-1572982270458-ad80e5fcc49a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbmR3aWNoJTIwY2FmZXxlbnwxfHx8fDE3NzY0Mzg4MDl8MA&ixlib=rb-4.1.0&q=80&w=400',
        available: true,
        category: 'Đồ ăn',
        order: 5
      },
    ];

    const keys = initialMenuItems.map(item => `menu_item:${item.id}`);
    await kv.mset(keys, initialMenuItems);

    return c.json({ success: true, count: initialMenuItems.length });
  } catch (error) {
    console.log(`Error seeding data: ${error}`);
    return c.json({ error: error.message }, 500);
  }
});

// ============ MENU ITEMS ROUTES ============

// Get all menu items
app.get("/make-server-f5317610/menu-items", async (c) => {
  try {
    const items = await kv.getByPrefix("menu_item:");
    return c.json(items);
  } catch (error) {
    console.log(`Error fetching menu items: ${error}`);
    return c.json({ error: error.message }, 500);
  }
});

// Get single menu item
app.get("/make-server-f5317610/menu-items/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const item = await kv.get(`menu_item:${id}`);
    if (!item) {
      return c.json({ error: "Menu item not found" }, 404);
    }
    return c.json(item);
  } catch (error) {
    console.log(`Error fetching menu item: ${error}`);
    return c.json({ error: error.message }, 500);
  }
});

// Create menu item
app.post("/make-server-f5317610/menu-items", async (c) => {
  try {
    const body = await c.req.json();
    const { name, price, image, available, category, order } = body;

    if (!name || !price || !image) {
      return c.json({ error: "Missing required fields: name, price, image" }, 400);
    }

    const id = Date.now().toString();
    const newItem = {
      id,
      name,
      price,
      image,
      available: available ?? true,
      category: category ?? "Uncategorized",
      order: order ?? 0,
    };

    await kv.set(`menu_item:${id}`, newItem);
    return c.json(newItem, 201);
  } catch (error) {
    console.log(`Error creating menu item: ${error}`);
    return c.json({ error: error.message }, 500);
  }
});

// Update menu item
app.put("/make-server-f5317610/menu-items/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();

    const existing = await kv.get(`menu_item:${id}`);
    if (!existing) {
      return c.json({ error: "Menu item not found" }, 404);
    }

    const updated = { ...existing, ...updates, id };
    await kv.set(`menu_item:${id}`, updated);
    return c.json(updated);
  } catch (error) {
    console.log(`Error updating menu item: ${error}`);
    return c.json({ error: error.message }, 500);
  }
});

// Toggle availability
app.patch("/make-server-f5317610/menu-items/:id/toggle", async (c) => {
  try {
    const id = c.req.param("id");
    const item = await kv.get(`menu_item:${id}`);

    if (!item) {
      return c.json({ error: "Menu item not found" }, 404);
    }

    const updated = { ...item, available: !item.available };
    await kv.set(`menu_item:${id}`, updated);
    return c.json(updated);
  } catch (error) {
    console.log(`Error toggling menu item availability: ${error}`);
    return c.json({ error: error.message }, 500);
  }
});

// Delete menu item
app.delete("/make-server-f5317610/menu-items/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`menu_item:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting menu item: ${error}`);
    return c.json({ error: error.message }, 500);
  }
});

// ============ ORDERS ROUTES ============

// Get all orders
app.get("/make-server-f5317610/orders", async (c) => {
  try {
    const orders = await kv.getByPrefix("order:");
    return c.json(orders);
  } catch (error) {
    console.log(`Error fetching orders: ${error}`);
    return c.json({ error: error.message }, 500);
  }
});

// Get single order
app.get("/make-server-f5317610/orders/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const order = await kv.get(`order:${id}`);
    if (!order) {
      return c.json({ error: "Order not found" }, 404);
    }
    return c.json(order);
  } catch (error) {
    console.log(`Error fetching order: ${error}`);
    return c.json({ error: error.message }, 500);
  }
});

// Create order
app.post("/make-server-f5317610/orders", async (c) => {
  try {
    const body = await c.req.json();
    const { tableNumber, items, total } = body;

    if (!tableNumber || !items || !total) {
      return c.json({ error: "Missing required fields: tableNumber, items, total" }, 400);
    }

    const orderId = `ORD${Date.now()}`;
    const newOrder = {
      id: orderId,
      tableNumber,
      items,
      total,
      status: 'processing',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`order:${orderId}`, newOrder);
    return c.json(newOrder, 201);
  } catch (error) {
    console.log(`Error creating order: ${error}`);
    return c.json({ error: error.message }, 500);
  }
});

// Update order status
app.patch("/make-server-f5317610/orders/:id/status", async (c) => {
  try {
    const id = c.req.param("id");
    const { status } = await c.req.json();

    if (!status) {
      return c.json({ error: "Missing status field" }, 400);
    }

    const order = await kv.get(`order:${id}`);
    if (!order) {
      return c.json({ error: "Order not found" }, 404);
    }

    const updated = { ...order, status };
    await kv.set(`order:${id}`, updated);
    return c.json(updated);
  } catch (error) {
    console.log(`Error updating order status: ${error}`);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);