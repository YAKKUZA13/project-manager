document.getElementById('getProjectButton').addEventListener('click', () => {
    const projectId = document.getElementById('projectIdInput').value;
    fetch(`/projects/${projectId}`)
        .then(response => response.json())
        .then(project => {
            if (project) {
                const app = document.getElementById('app');
                app.innerHTML = `
                    <h1>${project.name}</h1>
                    <div id="tasks"></div>
                    <form id="taskForm">
                        <input type="text" id="taskDescription" placeholder="Новая задача" required>
                        <button type="submit">Добавить задачу</button>
                    </form>
                `;
                const taskForm = document.getElementById('taskForm');
                taskForm.onsubmit = (e) => {
                    e.preventDefault();
                    addTask(projectId);
                };
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
                    document.getElementById('tasks').appendChild(taskElement);
                });
            } else {
                console.error('Проект не найден');
            }
        })
        .catch(error => console.error('Ошибка:', error));
});

document.getElementById('createProjectButton').addEventListener('click', () => {
    const projectName = document.getElementById('projectNameInput').value;
    const newProject = {
        name: projectName,
        tasks: []
    };

    fetch('/projects', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
    })
    .then(response => {
        if (response.ok) {
            console.log('Проект создан');
        } else {
            console.error('Ошибка при создании проекта');
        }
    })
    .catch(error => console.error('Ошибка:', error));
});

async function toggleTask(projectId, taskId, completed) {
    await fetch(`/project/${projectId}/task`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ taskId, completed })
    });
    loadProject(projectId);
}

async function addTask(projectId) {
    const taskDescription = document.getElementById('taskDescription').value;
    await fetch(`/project/${projectId}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description: taskDescription })
    });
    loadProject(projectId);
}

async function deleteTask(projectId, taskId) {
    await fetch(`/project/${projectId}/task/${taskId}`, {
        method: 'DELETE'
    });
    loadProject(projectId);
}

function loadProject(projectId) {
    document.getElementById('getProjectButton').click();
}
