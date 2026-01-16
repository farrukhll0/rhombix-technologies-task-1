const input = document.getElementById('taskInput');
const list = document.getElementById('taskList');

document.addEventListener('DOMContentLoaded', renderTasks);

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

function addTask() {
  const text = input.value.trim();
  if (!text) return alert('Please enter a task');

  const task = {
    id: Date.now(),
    text,
    completed: false
  };

  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);

  renderTask(task);
  input.value = '';
}

function renderTask(task) {
  const li = document.createElement('li');
  li.className = 'task-item';
  li.dataset.id = task.id;

  li.innerHTML = `
    <span class="task-text ${task.completed ? 'task-completed' : ''}">
      ${task.text}
    </span>
    <div>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    </div>
  `;

  list.appendChild(li);
}

list.addEventListener('click', e => {
  const li = e.target.closest('li');
  if (!li) return;

  const id = Number(li.dataset.id);
  const tasks = getTasks();
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  if (e.target.classList.contains('delete-btn')) {
    if (!confirm('Delete this task?')) return;
    saveTasks(tasks.filter(t => t.id !== id));
    li.remove();
  }

  if (e.target.classList.contains('edit-btn')) {
    const updated = prompt('Edit task', task.text);
    if (!updated?.trim()) return;

    task.text = updated.trim();
    li.querySelector('.task-text').textContent = task.text;
    saveTasks(tasks);
  }

  if (e.target.classList.contains('task-text')) {
    task.completed = !task.completed;
    e.target.classList.toggle('task-completed');
    saveTasks(tasks);
  }
});

function renderTasks() {
  getTasks().forEach(renderTask);
}

function getTasks() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
