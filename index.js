    // Select DOM elements
        const taskInput = document.getElementById('newTask');
        const addTaskBtn = document.getElementById('addTaskBtn');
        const taskList = document.getElementById('taskList');
        const exportTasks = document.getElementById('exportTasks');
        const importTasks = document.getElementById('importTasks');
        const darkModeToggle = document.getElementById('darkModeToggle');
        const completedCount = document.getElementById('completedCount');
        const incompleteCount = document.getElementById('incompleteCount');

        // Load tasks from Local Storage
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        // Function to render tasks
        function renderTasks() {
            taskList.innerHTML = '';
            tasks.forEach((task, index) => {
                const li = document.createElement('li');
                li.dataset.index = index;
                li.classList.add(
                    'flex',
                    'items-center',
                    'justify-between',
                    'p-3',
                    'bg-gray-50',
                    'border',
                    'border-gray-200',
                    'rounded-lg',
                    'shadow-sm',
                    'hover:bg-gray-100',
                    'transition',
                    'duration-200',
                    'task-enter'
                );
                if (task.completed) {
                    li.classList.add('bg-green-100', 'border-green-200');
                }
                li.innerHTML = `
                    <div class="flex items-center flex-1">
                        <input
                            type="checkbox"
                            ${task.completed ? 'checked' : ''}
                            onchange="toggleTask(${index})"
                            class="mr-3 form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                        />
                        <span
                            contenteditable="true"
                            onBlur="updateTask(this, ${index})"
                            class="flex-1 ${task.completed ? 'line-through text-gray-500' : ''}"
                        >${task.text}</span>
                    </div>
                    <button
                        onclick="deleteTask(${index})"
                        class="ml-2 text-red-500 hover:text-red-600 focus:outline-none"
                    >
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                taskList.appendChild(li);
                setTimeout(() => li.classList.remove('task-enter'), 10);
            });

            updateStatistics();

            // Enable drag and drop
            Sortable.create(taskList, {
                animation: 150,
                onEnd: (evt) => {
                    const movedTask = tasks.splice(evt.oldIndex, 1)[0];
                    tasks.splice(evt.newIndex, 0, movedTask);
                    saveTasks();
                }
            });
        }

        // Function to add a new task
        function addTask() {
            const taskText = taskInput.value.trim();
            if (taskText !== '') {
                tasks.push({
                    text: taskText,
                    completed: false,
                    date: new Date().toLocaleString()
                });
                saveTasks();
                taskInput.value = '';
            }
        }

        // Function to delete a task
        function deleteTask(index) {
            const li = taskList.children[index];
            li.classList.add('task-exit-active');
            setTimeout(() => {
                tasks.splice(index, 1);
                saveTasks();
            }, 300);
        }

        // Function to update a task
        function updateTask(element, index) {
            const newText = element.textContent.trim();
            if (newText !== '') {
                tasks[index].text = newText;
            } else {
                deleteTask(index);
            }
            saveTasks();
        }

        // Function to toggle task completion
        function toggleTask(index) {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
        }

        // Function to save tasks to Local Storage
        function saveTasks() {
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        }

        // Function to update statistics
        function updateStatistics() {
            completedCount.textContent = tasks.filter(task => task.completed).length;
            incompleteCount.textContent = tasks.filter(task => !task.completed).length;
        }

        // Event listeners
        addTaskBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTask();
        });

        // Export tasks
        exportTasks.addEventListener('click', () => {
            const data = JSON.stringify(tasks);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'tasks.json';
            a.click();
            URL.revokeObjectURL(url);
        });

        // Import tasks
        importTasks.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    tasks = JSON.parse(e.target.result);
                    saveTasks();
                };
                reader.readAsText(file);
            }
        });

        // Dark Mode Toggle
        darkModeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            if (document.documentElement.classList.contains('dark')) {
                document.body.classList.remove('from-purple-400', 'to-indigo-600');
                document.body.classList.add('from-gray-800', 'to-gray-900');
            } else {
                document.body.classList.remove('from-gray-800', 'to-gray-900');
                document.body.classList.add('from-purple-400', 'to-indigo-600');
            }
        });

        // Initial render
        renderTasks();
