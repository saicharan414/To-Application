// Task Management System
class TodoApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.taskInput = document.getElementById('taskInput');
        this.addBtn = document.getElementById('addBtn');
        this.taskList = document.getElementById('taskList');
        this.emptyState = document.getElementById('emptyState');
        this.totalTasksSpan = document.getElementById('totalTasks');
        this.completedTasksSpan = document.getElementById('completedTasks');

        this.init();
    }

    init() {
        // Event listeners for adding tasks
        this.addBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Event delegation for task actions (delete, complete, edit)
        this.taskList.addEventListener('click', (e) => this.handleTaskAction(e));

        // Initial render
        this.render();
    }

    // Add new task
    addTask() {
        const taskText = this.taskInput.value.trim();

        if (taskText === '') {
            alert('Please enter a task!');
            this.taskInput.focus();
            return;
        }

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toLocaleString()
        };

        this.tasks.push(newTask);
        this.saveTasks();
        this.taskInput.value = '';
        this.taskInput.focus();
        this.render();
    }

    // Handle task actions (delete, complete, etc.)
    handleTaskAction(e) {
        const deleteBtn = e.target.closest('.delete-btn');
        const checkbox = e.target.closest('.task-checkbox');

        if (deleteBtn) {
            const taskId = parseInt(deleteBtn.dataset.id);
            this.deleteTask(taskId);
        }

        if (checkbox) {
            const taskId = parseInt(checkbox.dataset.id);
            this.toggleComplete(taskId);
        }
    }

    // Delete task
    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.saveTasks();
            this.render();
        }
    }

    // Toggle task completion status
    toggleComplete(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
        }
    }

    // Render all tasks
    render() {
        this.taskList.innerHTML = '';

        if (this.tasks.length === 0) {
            this.emptyState.classList.add('active');
        } else {
            this.emptyState.classList.remove('active');
            this.tasks.forEach(task => {
                const taskItem = this.createTaskElement(task);
                this.taskList.appendChild(taskItem);
            });
        }

        this.updateStats();
    }

    // Create task element
    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.dataset.id = task.id;

        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'task-actions';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '🗑️ Delete';
        deleteBtn.dataset.id = task.id;

        actionsDiv.appendChild(deleteBtn);

        li.appendChild(checkbox);
        li.appendChild(taskText);
        li.appendChild(actionsDiv);

        return li;
    }

    // Update statistics
    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;

        this.totalTasksSpan.textContent = total;
        this.completedTasksSpan.textContent = completed;
    }

    // Save tasks to localStorage
    saveTasks() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    }

    // Load tasks from localStorage
    loadTasks() {
        const saved = localStorage.getItem('todoTasks');
        return saved ? JSON.parse(saved) : [];
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
