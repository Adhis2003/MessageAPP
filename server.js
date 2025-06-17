const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Helper: Load todos
function loadTodos() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
}

// Helper: Save todos
function saveTodos(todos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}

// POST: Add a new todo
app.post('/api/todo', (req, res) => {
  const { task } = req.body;
  if (!task) return res.status(400).json({ error: 'Task is required' });

  const todos = loadTodos();
  const newTodo = {
    id: todos.length + 1,
    task,
    done: false,
    createdAt: new Date().toISOString()
  };

  todos.push(newTodo);
  saveTodos(todos);

  res.status(201).json({ success: true, todo: newTodo });
});

// GET: Return all todos
app.get('/api/todo', (req, res) => {
  const todos = loadTodos();
  res.json(todos);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
