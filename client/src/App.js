import './index.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import shortid from 'shortid';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const toEmit = true;

  useEffect(() => {
    const socket = io('http://localhost:8000');
    setSocket(socket);
    socket.on('updateData', (tasks) => updateTasks(tasks));
    socket.on('addTask', (task) => addTask(task));
    socket.on('removeTask', (id) => removeTask(id));
  }, []);
  // tylko raz - dlaczego?

  const updateTasks = (tasks) => {
    setTasks(tasks);
  };

  const removeTask = (id, toEmit) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== id)); // ??? callback? -uwaga!
    if (toEmit) {
      socket.emit('removeTask', id);
    }
  };

  const submitForm = (event) => {
    event.preventDefault();
    addTask({ id: shortid(), name: taskName });
    socket.emit('addTask', { id: shortid(), name: taskName });
  };

  const addTask = (task) => {
    setTasks((tasks) => [...tasks, task]); // -uwaga
    setTaskName('');
  };

  return (
    <div className='App'>
      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className='tasks-section' id='tasks-section'>
        <h2>Tasks</h2>

        <ul className='tasks-section__list' id='tasks-list'>
          {tasks.map((task) => (
            <li className='task' key={task.id}>
              {task.name}
              <button
                className='btn btn--red'
                onClick={() => removeTask(task.id, toEmit)} // dlaczego z () =>
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <form id='add-task-form' onSubmit={submitForm}>
          <input
            className='text-input'
            autoComplete='off'
            type='text'
            placeholder='Type your description'
            id='task-name'
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <button className='btn' type='submit'>
            Add
          </button>
        </form>
      </section>
    </div>
  );
};

export default App;
