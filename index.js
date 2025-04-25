const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Temporary in-memory storage for to-do items
const todos = [];

// Route: Home Page
app.get('/', (req, res) => {
    let todoListHtml = '<h1>To-Do List</h1><ul>';
    todos.forEach((todo, index) => {
        todoListHtml += `<li>${todo} <form style="display:inline;" method="POST" action="/delete"><button type="submit" name="index" value="${index}">Delete</button></form></li>`;
    });
    todoListHtml += '</ul>';

    const html = `
        ${todoListHtml}
        <form method="POST" action="/add">
            <input type="text" name="todo" placeholder="Add tasks..." required>
            <button type="submit">Add</button>
        </form>
    `;

    res.send(html);
});

// Route: Add a New To-Do
app.post('/add', (req, res) => {
    const newTodo = req.body.todo;
    if (newTodo) {
        todos.push(newTodo);
    }
    res.redirect('/');
});

// Route: Delete a To-Do
app.post('/delete', (req, res) => {
    const index = req.body.index;
    if (index !== undefined) {
        todos.splice(index, 1);
    }
    res.redirect('/');
});

// Start the Server
app.listen(port, () => {
    console.log(`To-Do List app running at http://localhost:${port}`);
});