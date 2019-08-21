const express = require("express");
const server = express();

server.use(express.json());

const projects = [];
let totalRequest = 0;

server.use((req, res, next) => {
  console.time("Request");

  totalRequest++;

  console.log(`Total request: ${totalRequest}`);

  next();

  console.timeEnd("Request");
});

function verifyIDExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => {
    return p.id === id;
  });

  if (!project) {
    return res.status(400).json({ error: "ID not found." });
  }

  req.project = project;

  return next();
}

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = { id, title, tasks: [] };

  projects.push(project);

  res.json(projects);
});

server.post("/projects/:id/tasks", verifyIDExists, (req, res) => {
  const { title } = req.body;

  req.project.tasks.push(title);

  return res.json(projects);
});

server.get("/projects", (req, res) => {
  res.json(projects);
});

server.put("/projects/:id", verifyIDExists, (req, res) => {
  const { title } = req.body;

  req.project.title = title;

  res.json(projects);
});

server.delete("/projects/:id", verifyIDExists, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(p => p.id === id);

  projects.splice(index, 1);

  res.send();
});

server.listen(3000);
