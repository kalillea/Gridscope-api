const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
const port = 3000;

app.use(cors()); // allow Angular app at :4200
app.use(express.json());

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function generateHistory(componentId) {
  const history = [];
  const points = 50;

  for (let i = 0; i < points; i++) {
    history.push({
      timestamp: randomDate(
        new Date(2018, 0, 1),
        new Date(2025, 0, 1)
      ).toISOString(),
      value: Math.floor(Math.random() * 100),
    });
  }

  // Sort by timestamp
  history.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return history;
}

// In-memory "database"
let components = [
  {
    id: crypto.randomUUID(),
    name: "Hovedmåler 1",
    status: "active",
    type: "meter",
    lastUpdated: randomDate(
      new Date(2018, 0, 1),
      new Date(2025, 0, 1)
    ).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: "Siemens Nord",
    status: "maintenance",
    type: "transformer",
    lastUpdated: randomDate(
      new Date(2018, 0, 1),
      new Date(2025, 0, 1)
    ).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: "Batteri-Siemens",
    status: "inactive",
    type: "battery",
    lastUpdated: randomDate(
      new Date(2018, 0, 1),
      new Date(2025, 0, 1)
    ).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: "Reserve",
    status: "maintenance",
    type: "battery",
    lastUpdated: randomDate(
      new Date(2018, 0, 1),
      new Date(2025, 0, 1)
    ).toISOString(),
  },
];

let historyByComponent = {};
for (const comp of components) {
  historyByComponent[comp.id] = generateHistory(comp.id);
}

const validStatuses = ["active", "inactive", "maintenance"];

function isValidStatus(status) {
  return validStatuses.includes(status);
}

// Routes

// GET /api/components?offset=&limit=   (with pagination)
app.get("/api/components", (req, res) => {
  const offset = parseInt(req.query.offset ?? "0", 10);
  const limit = parseInt(req.query.limit ?? "50", 10);

  const slice = components.slice(offset, offset + limit);

  res.status(200).json({
    items: slice,
    total: components.length,
    offset,
    limit,
  });
});

// GET /api/components/:id
app.get("/api/components/:id", (req, res) => {
  const comp = components.find((c) => c.id === req.params.id);
  if (!comp) {
    return res.status(404).json({ message: "Component not found" });
  }
  res.status(200).json(comp);
});

// GET /api/history/:id
app.get("/api/history/:id", (req, res) => {
  const id = req.params.id;
  const history = historyByComponent[id];

  if (!history) {
    return res.status(404).json({ message: "History not found for component" });
  }

  res.status(200).json(history);
});

// POST /api/components   (register new component)
app.post("/api/components", (req, res) => {
  const { name, status, type } = req.body;

  // Input validation
  if (!name || typeof name !== "string") {
    return res
      .status(400)
      .json({ message: "Name is required and must be a string" });
  }

  if (!isValidStatus(status)) {
    return res
      .status(400)
      .json({ message: `Status must be one of: ${validStatuses.join(", ")}` });
  }

  if (!type || typeof type !== "string") {
    return res
      .status(400)
      .json({ message: "Type is required and must be a string" });
  }

  const newComp = {
    id: crypto.randomUUID(),
    name,
    status,
    type,
    lastUpdated: new Date().toISOString(),
  };

  components.push(newComp);
  res.status(201).json(newComp);
});

// PUT /api/components/:id   (update component)
app.put("/api/components/:id", (req, res) => {
  const { name, status, type } = req.body;

  const comp = components.find((c) => c.id === req.params.id);
  if (!comp) {
    return res.status(404).json({ message: "Component not found" });
  }

  if (status !== undefined && !isValidStatus(status)) {
    return res
      .status(400)
      .json({ message: `Status must be one of: ${validStatuses.join(", ")}` });
  }

  if (name !== undefined) {
    if (!name || typeof name !== "string") {
      return res
        .status(400)
        .json({ message: "Name must be a non-empty string" });
    }
    comp.name = name;
  }

  if (status !== undefined) {
    comp.status = status;
  }

  if (type !== undefined) {
    if (!type || typeof type !== "string") {
      return res
        .status(400)
        .json({ message: "Type must be a non-empty string" });
    }
    comp.type = type;
  }

  comp.lastUpdated = new Date().toISOString();

  res.status(200).json(comp);
});

// DELETE /api/components/:id
app.delete("/api/components/:id", (req, res) => {
  const before = components.length;
  components = components.filter((c) => c.id !== req.params.id);

  if (components.length === before) {
    return res.status(404).json({ message: "Component not found" });
  }

  // 204 No Content (successful delete, no body)
  res.status(204).send();
});

// Basic error handler - for unexpected errors -> 500
app.use((err, req, res, next) => {
  console.error("Unexpected error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Start server
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
