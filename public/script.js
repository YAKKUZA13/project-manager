// Событие нажатия кнопки "Открыть проект"
document.getElementById('getProjectButton').addEventListener('click', () => {
    // Получение значения ID проекта из текстового поля
    const projectId = document.getElementById('projectIdInput').value;
    
    // Отправка GET-запроса для получения данных проекта по ID
    fetch(`/projects/${projectId}`)
        .then(response => response.json()) // Преобразование ответа в формат JSON
        .then(project => {
            if (project) {
                // Очистка содержимого элемента с id="app"
                const app = document.getElementById('app');
                app.innerHTML = `
                    <h1>${project.name}</h1>
                    <div id="tasks"></div>
                    <form id="taskForm">
                        <input type="text" id="taskDescription" placeholder="Новая задача" required>
                        <button type="submit">Добавить задачу</button>
                    </form>
                `;
                
                // Привязка события отправки формы для добавления задачи
                const taskForm = document.getElementById('taskForm');
                taskForm.onsubmit = (e) => {
                    e.preventDefault(); // Предотвращение перезагрузки страницы
                    addTask(projectId); // Вызов функции добавления задачи
                };
                
                // Перебор задач проекта и их отображение
                project.tasks.forEach(task => {
                    const taskElement = document.createElement('div');
                    taskElement.className = 'task' + (task.completed ? ' completed' : '');
                    taskElement.innerHTML = `
                        <span>${task.description}</span>
                        <div>
                            <button onclick="deleteTask('${projectId}', '${task.id}')">Удалить</button>
                            <button onclick="toggleTask('${projectId}', '${task.id}', ${!task.completed})">${task.completed ? 'Отметить невыполненной' : 'Отметить выполненной'}</button>
                        </div>
                    `;
                    document.getElementById('tasks').appendChild(taskElement); // Добавление задачи в элемент с id="tasks"
                });
            } else {
                console.error('Проект не найден'); // Обработка ошибки, если проект не найден
            }
        })
        .catch(error => console.error('Ошибка:', error)); // Обработка ошибок запроса
});

// Событие нажатия кнопки "Создать проект"
document.getElementById('createProjectButton').addEventListener('click', () => {
    const projectName = document.getElementById('projectNameInput').value;
    const newProject = {
        name: projectName,
        tasks: []
    };

    // Отправка POST-запроса для создания нового проекта
    fetch('/projects', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject), // Преобразование объекта проекта в JSON
    })
    .then(response => {
        if (response.ok) {
            console.log('Проект создан'); // Сообщение об успешном создании проекта
        } else {
            console.error('Ошибка при создании проекта'); // Обработка ошибки создания проекта
        }
    })
    .catch(error => console.error('Ошибка:', error)); // Обработка ошибок запроса
});

// Функция для переключения состояния задачи (выполнена/невыполнена)
async function toggleTask(projectId, taskId, completed) {
    await fetch(`/project/${projectId}/task`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ taskId, completed }) // Отправка данных о задаче
    });
    loadProject(projectId); // Перезагрузка данных проекта
}

// Функция для добавления новой задачи
async function addTask(projectId) {
    const taskDescription = document.getElementById('taskDescription').value;
    await fetch(`/project/${projectId}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description: taskDescription }) // Отправка данных новой задачи
    });
    loadProject(projectId); // Перезагрузка данных проекта
}

// Функция для удаления задачи
async function deleteTask(projectId, taskId) {
    await fetch(`/project/${projectId}/task/${taskId}`, {
        method: 'DELETE'
    });
    loadProject(projectId); // Перезагрузка данных проекта
}

// Функция для перезагрузки данных проекта
function loadProject(projectId) {
    document.getElementById('getProjectButton').click(); // Эмуляция нажатия кнопки "Открыть проект"
}