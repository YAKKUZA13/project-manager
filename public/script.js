async function loadProject(projectId) {
  const response = await fetch(`/project/${projectId}`);
  const project = await response.json();

  const app = document.getElementById('app');
  app.innerHTML = `<h1>${project.name}</h1>`;

  const taskForm = document.createElement('form');
  taskForm.innerHTML = `
      <input type="text" id="taskDescription" placeholder="Новая задача" required>
      <button type="submit">Add Task</button>
  `;
  taskForm.onsubmit = (e) => {
      e.preventDefault();
      addTask(projectId);
  };
  app.appendChild(taskForm);

  project.tasks.forEach(task => {
      const taskElement = document.createElement('div');
      taskElement.className = 'task' + (task.completed ? ' completed' : '');
      taskElement.innerHTML = `
          <span>${task.description}</span>
          <div>
              <button onclick="deleteTask('${projectId}', '${task.id}')">Удалить</button>
              <button onclick="toggleTask('${projectId}', '${task.id}', ${!task.completed})">${task.completed ? 'Unmark' : 'Отметить выполненым'}</button>
          </div>
      `;
      app.appendChild(taskElement);
  });
}

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

loadProject('2'); // Пример загрузки проекта с ID 2
