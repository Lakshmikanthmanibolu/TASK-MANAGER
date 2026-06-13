const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const totalTasks = document.getElementById('totalTasks');
const completedTasks = document.getElementById('completedTasks');
const pendingTasks = document.getElementById('pendingTasks');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');
const filterButtons = document.querySelectorAll('.filter-btn');
const quickTags = document.querySelectorAll('.quick-tag');

let tasks = [];
let currentFilter = 'all';

function showNotification(message) {
    notificationText.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

function saveTasks() {
    localStorage.setItem('taskManagerTasks', JSON.stringify(tasks));
}

function loadTasks() {
    const storedTasks = localStorage.getItem('taskManagerTasks');
    tasks = storedTasks ? JSON.parse(storedTasks) : [];
}

function addTask(taskText) {
    const text = taskText.trim();
    if (text === '') {
        showNotification('Please enter a task');
        return;
    }

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
    showNotification('Task added successfully');
}

function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    showNotification('Task deleted');
}

function getFilteredTasks() {
    if (currentFilter === 'pending') {
        return tasks.filter(task => !task.completed);
    }
    if (currentFilter === 'completed') {
        return tasks.filter(task => task.completed);
    }
    return tasks;
}

function renderTasks() {
    const filteredTasks = getFilteredTasks();

    taskList.innerHTML = '';

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <div class="empty-emoji">📝</div>
                <h3>No tasks found</h3>
                <p>Try adding a new task or changing the filter.</p>
            </div>
        `;
    } else {
        filteredTasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;

            taskItem.innerHTML = `
                <div class="task-left">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <span class="task-text">${task.text}</span>
                </div>
                <div class="task-actions">
                    <button class="action-btn complete-btn" title="Mark Complete">✓</button>
                    <button class="action-btn delete-btn" title="Delete Task">🗑</button>
                </div>
            `;

            const checkbox = taskItem.querySelector('.task-checkbox');
            const completeBtn = taskItem.querySelector('.complete-btn');
            const deleteBtn = taskItem.querySelector('.delete-btn');

            checkbox.addEventListener('change', () => toggleTask(task.id));
            completeBtn.addEventListener('click', () => toggleTask(task.id));
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            taskList.appendChild(taskItem);
        });
    }

    updateStats();
}

function updateStats() {
    totalTasks.textContent = tasks.length;
    completedTasks.textContent = tasks.filter(task => task.completed).length;
    pendingTasks.textContent = tasks.filter(task => !task.completed).length;
}

addTaskBtn.addEventListener('click', () => addTask(taskInput.value));

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask(taskInput.value);
    }
});

quickTags.forEach(tag => {
    tag.addEventListener('click', () => {
        addTask(tag.dataset.task);
    });
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.dataset.filter;
        renderTasks();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
});