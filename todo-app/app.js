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

app.put("/todos/:id/markAsCompleted", async (request, response) => {
     console.log("We have updated a todo with ID: ", request.params.id);
  
     try {
       const todo = await Todo.findByPk(request.params.id);
       if (!todo) {
         return response.status(404).json({ error: "Todo not found" });
       }
  
       // Update the completed status in todo
       todo.completed = true;
       await todo.save(); // Save the changes of todo
  
       return response.json(todo); // Return the updated todo .
     } catch (error) {
       console.error(error);
       return response.status(500).json({ error: "Failed to Update todo" });
     }
   });

// Delete a todo by the required 
app.delete(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    console.log("We have to delete a Todo with ID: ", req.params.id);
    try {
      await Todo.remove(req.params.id, req.user.id);
      const check = await Todo.findByPk(req.params.id);
      if (check) {
        return res.json({ success: false });
      }
      return res.json({ success: true });
    } catch (error) {
      return res.status(422).json(error);
    }
  }
);


// Render the main page with todos 
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
