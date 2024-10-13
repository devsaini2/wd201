/* eslint-disable no-undef */
const request = require("supertest");
const db = require("../models/index");
const app = require("../app");

let server, agent;

describe("Todo test suit", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });


  afterAll(async () => {
    try{
      await db.sequelize.close();
      await server.close();
    }
    catch (error) {
      console.log(error);
    }   
  });

  test("responds with json at /todos", async () => {
    const response = await agent.post("/todos").send({
      title: "Todo title 1",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    expect(response.statusCode).toBe(302);
    expect(response.headers["content-type"]).toBe(
    "application/json; charset=utf-8",
    );

    const parsedResponse = JSON.parse(response.text);
     expect(parsedResponse.id).toBeDefined();
  });

  test("mark a todo as completed", async () => {
     const response = await agent.post("/todos").send({
       title: "Todo title 1",
       dueDate: new Date().toISOString(),
     });
     const parsedResponse = JSON.parse(response.text);
     const todoid = parsedResponse.id;

     expect(parsedResponse.completed).toBe(false);

    const markCompleteResponse = await agent
       .put(`/todos/${todoid}/markAsCompleted`)
       .send();
     const parsedMarkCompleteResponse = JSON.parse(markCompleteResponse.text);
     expect(parsedMarkCompleteResponse.completed).toBe(true);
    });

    
    test("Fetches all todos in the database using /todos Endpoint", async () => {
      await agent.post("/todos").send({
        title: "Fetch todos title",
        dueDate: new Date().toISOString(),
        completed: false,
      });
      await agent.post("/todos").send({
        title: "Buy tiltle",
        dueDate: new Date().toISOString(),
        completed: false,
      });
      const response = await agent.get("/todos");
      const parsedResponse = JSON.parse(response.text);
  
      expect(parsedResponse.length).toBe(4);
      expect(parsedResponse[3]["title"]).toBe("Buy title");
    });

  test("Deletes a todo with the given ID if it exists", async () => {
     const response = await agent.post("/todos").send({
       title: "Delete title",
       dueDate: new Date().toISOString(),
     });
     const parsedResponse = JSON.parse(response.text);
     const todoid = parsedResponse.id;
     const deleteResponse = await agent.delete(`/todos/${todoid}`);

     expect(deleteResponse.statusCode).toBe(200);
   });


  test("Returns False for an non-existing ID", async () => {
    const response = await request(app).delete("/todos/999");
    expect(response.body).toBe(false);
  });

  // Removed 
});