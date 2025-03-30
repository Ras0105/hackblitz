document.addEventListener('DOMContentLoaded', function() {
    
    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');
    const allBtn = document.getElementById('all-btn');
    const activeBtn = document.getElementById('active-btn');
    const completedBtn = document.getElementById('completed-btn');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const remainingCount = document.getElementById('remaining-count');
    const progressBar = document.getElementById('progress');
    const progressText = document.getElementById('progress-text');

    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    
    function init() {
        renderTasks();
        updateProgress();
        addBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addTask();
        });
        allBtn.addEventListener('click', () => setFilter('all'));
        activeBtn.addEventListener('click', () => setFilter('active'));
        completedBtn.addEventListener('click', () => setFilter('completed'));
        clearCompletedBtn.addEventListener('click', clearCompleted);
    }

    
    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            const newTask = {
                id: Date.now(),
                text,
                completed: false
            };
            tasks.push(newTask);
            saveTasks();
            renderTasks();
            updateProgress();
            taskInput.value = '';
        }
    }


    function renderTasks() {
        taskList.innerHTML = '';
        
        let filteredTasks = tasks;
        if (currentFilter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }
        
        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<p class="no-tasks">No tasks found</p>';
            return;
        }
        
        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            taskItem.dataset.id = task.id;
            
            taskItem.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                <button class="delete-btn">×</button>
            `;
            
            taskList.appendChild(taskItem);
            
            // Add event listeners
            const checkbox = taskItem.querySelector('.task-checkbox');
            const deleteBtn = taskItem.querySelector('.delete-btn');
            const taskText = taskItem.querySelector('.task-text');
            
            checkbox.addEventListener('change', () => toggleTask(task.id));
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
            taskText.addEventListener('dblclick', () => editTask(task.id, taskText));
        });
    }

    
    function toggleTask(id) {
        tasks = tasks.map(task => 
            task.id === id ? {...task, completed: !task.completed} : task
        );
        saveTasks();
        renderTasks();
        updateProgress();
    }

    
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
        updateProgress();
    }

    
    function editTask(id, taskTextElement) {
        const currentText = taskTextElement.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.className = 'edit-input';
        
        taskTextElement.replaceWith(input);
        input.focus();
        
        function saveEdit() {
            const newText = input.value.trim();
            if (newText) {
                tasks = tasks.map(task => 
                    task.id === id ? {...task, text: newText} : task
                );
                saveTasks();
            }
            renderTasks();
        }
        
        input.addEventListener('blur', saveEdit);
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') saveEdit();
        });
    }

    
    function setFilter(filter) {
        currentFilter = filter;
        allBtn.classList.remove('active');
        activeBtn.classList.remove('active');
        completedBtn.classList.remove('active');
        
        if (filter === 'all') allBtn.classList.add('active');
        else if (filter === 'active') activeBtn.classList.add('active');
        else if (filter === 'completed') completedBtn.classList.add('active');
        
        renderTasks();
    }

    
    function clearCompleted() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
        updateProgress();
    }

    
    function updateProgress() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const remainingTasks = totalTasks - completedTasks;
        
        remainingCount.textContent = remainingTasks;
        
        if (totalTasks > 0) {
            const progressPercent = Math.round((completedTasks / totalTasks) * 100);
            progressBar.style.width = `${progressPercent}%`;
            progressText.textContent = `${progressPercent}% complete`;
        } else {
            progressBar.style.width = '0%';
            progressText.textContent = '0% complete';
        }
    }

    
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    
    init();
});