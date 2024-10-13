/* eslint-disable no-undef */

const { request, response } = require("express");
const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
const { title } = require("process");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));

app.set("View Engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

/*app.get("/", async (req, res) => {
  try {
    const allTodos = await Todo.getTodos();
    if (req.accepts("html")) {
      res.render("index", { allTodos });
    } else res.json(allTodos);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Failed to Fetch todos" });
  }
});

app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Failed to Fetch todos" });
  }
});*/

app.post("/todos", async (request, response) => {
  const { title, dueDate } = request.body;

  if (!title || !dueDate) {
    return response
      .status(400)
      .json({ error: "Title and Due Date are required." });
  }

  try {
    const todo = await Todo.addTodo({
      title,
      dueDate,
      completed: false,
    });
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

//content removed from here 
app.post("/todos/:id/update", async (req, res) => {
  const todoId = req.params.id;
  const { completed } = req.body;

  try {
    const todo = await Todo.findByPk(todoId);
    if (!todo) {
      return res.status(404).send("Todo not found");
    }

    todo.completed = completed; 
    await todo.save();
    return res.json({ message: "Todo updated successfully", todo });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Failed to update todo");
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);

  try {
    const todo = await Todo.remove(request.params.id);
    if (todo) {
      return response.json({ success: true });
    } else {
      return response.json(false);
    }
  } catch (error) {
    return response.status(422).json(error);
  }
});

// video content
app.get("/todos", (request, response) =>{
  console.log("Todo List")
})
app.post("/todos", async (request, response) => {
  console.log("creating a todo", request.body);
  try{
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
    })
    return response.json(todo);
  } catch (error){
    console.log(error);
    return response.status(422).json(error);
  }
})
app.put("/todos/:id/markAsCompleted", async (request, response) => {
  console.log("we have to update a todo with id:", request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  try{
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error){
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("todos/:id", (request, response) => {
  console.log("Deleted a todo by id:", request.params.id);
});
module.exports = app;