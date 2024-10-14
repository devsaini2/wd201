/* eslint-disable no-undef */

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { Todo } = require("./models");

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

// Create a todo
app.post("/todos", async (req, res) => {
  const { title, dueDate } = req.body;

  if (!title || !dueDate) {
    return res.status(400).json({ error: "Title and Due Date are required." });
  }

  try {
    const todo = await Todo.addTodo({
      title,
      dueDate,
      completed: false,
    });
    return res.json(todo);
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

// Fetch all todos 
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.getTodos();
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Failed to fetch todos" });
  }
});

// Mark a todo as completed this is required
app.put("/todos/:id/markAsCompleted", async (req, res) => {
  const todoId = req.params.id;

  try {
    const todo = await Todo.findByPk(todoId);
    if (!todo) {
      return res.status(404).send("Todo not found");
    }
    const updatedTodo = await todo.markAsCompleted();
    return res.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

// Delete a todo by the required 
app.delete("/todos/:id", async (req, res) => {
  const todoId = req.params.id;

  try {
    const deleted = await Todo.remove(todoId);
    if (deleted) {
      return res.json({ success: true });
    } else {
      return res.status(404).json({ success: false, message: "Todo not found" });
    }
  } catch (error) {
    return res.status(422).json(error);
  }  
});

// Render the main page with todos fetch data
app.get("/", async (req, res) => {
  try {
    const allTodos = await Todo.getTodos();
    res.render("index", { allTodos });
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Failed to fetch todos" });
  }
});

module.exports = app;
