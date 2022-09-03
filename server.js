const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

let tasks = [
  { id: 1, name: 'Shopping' },
  { id: 2, name: 'Playing guitar' },
];

io.on('connection', (socket) => {
  console.log('New client' + socket.id);
  socket.emit('updateData', tasks);
  console.log('wyemitowano', tasks);
  socket.on('addTask', (task) => {
    console.log('New task from' + socket.id);
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });
  socket.on('removeTask', (taskId) => {
    console.log('Remove task by' + socket.id);
    tasks = tasks.filter((task) => taskId !== task.id);
    socket.broadcast.emit('removeTask', taskId);
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' });
});

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.js'));
});
