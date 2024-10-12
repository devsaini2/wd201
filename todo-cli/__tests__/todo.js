/* eslint-disable no-undef */
const todoList = require('../todo');

const {all, markAsComplete, add} = todoList();

describe("TodoList Test Suite", () =>{
  beforeAll(() =>{
    add(
      {
        title: "Test todo",
        completed: false,
        dueDate: new Date().toISOString().slice(0,10)
      }
    );
  })
  test('should add new todo', () => { 
    const todoItemsCount = all.length;
    add(
      {
        title: "Test todo",
        completed: false,
        dueDate: new Date().toISOString().slice(0,10)
      }
    );
    expect(all.length).toBe(todoItemsCount + 1);
  });
  test("should mark a todo as completed", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
})

test("Retrieval of overDue items", () => {
  const todoItemCount = all.length;
  add({
    title: "Test todo",
    completed: false,
    dueDate: new Date().toISOString().slice(0,10) - 1,
  });
  expect(all.length).toBe(todoItemCount + 1);
});

test("Retrieval of dueToday items", () => {
  const todoItemCount = all.length;
  add({
    title: "Test todo",
    completed: false,
    dueDate: new Date().toISOString().slice(0,10),
  });
  expect(all.length).toBe(todoItemCount + 1);
});

test("Retrieval of dueLater items", () => {
  const todoItemCount = all.length;
  add({
    title: "Test todo",
    completed: false,
    dueDate: new Date().toISOString().slice(0,10) + 1,
  });
  expect(all.length).toBe(todoItemCount + 1);
})
});