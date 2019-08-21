const express = require("express");
const server = express();

server.use(express.json());

const projects = [];
var totalRequest = 0;

server.use((req, res, next) => {
  console.time("Request");

  //console.log(`Method: ${req.method}; URL: ${req.url}`);
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
  //id, title, tasks
  const { id, title, tasks } = req.body;

  const project = { id: id, title: title, tasks: tasks };

  projects.push(project);

  res.json(projects);
});

server.post("/projects/:id/tasks", verifyIDExists, (req, res) => {
  //const { id } = req.params;
  const { title } = req.body;

  // let project = projects.find(p => {
  //   return p.id === id;
  // });

  req.project.tasks.push(title);

  return res.json(projects);
});

server.get("/projects", (req, res) => {
  res.json(projects);
});

server.put("/projects/:id", verifyIDExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  let project = projects.find(p => {
    return p.id === id;
  });

  project.title = title;

  res.json(projects);
});

server.delete("/projects/:id", verifyIDExists, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(p => p.id === id);

  projects.splice(index, 1);

  res.send();
});

server.listen(3000);
