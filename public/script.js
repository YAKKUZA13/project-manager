let btn = document.getElementById("eveProjID")
btn.addEventListener('click', async ()=>{
    let id = document.getElementById("getProjId")
   loadProject(String(id.value))
})
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
              <button onclick="toggleTask('${projectId}', '${task.id}', ${!task.completed})">${task.completed ? 'Отменить' : 'Отметить выполненым'}</button>
          </div>
      `;
      app.appendChild(taskElement);
  });
}
// обновление задачи
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
// добавление задачи
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
// удаление задачи 
async function deleteTask(projectId, taskId) {
  await fetch(`/project/${projectId}/task/${taskId}`, {
      method: 'DELETE'
  });
  loadProject(projectId);
}

document.getElementById('projectForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const projectName = document.getElementById('projectName').value;

    fetch('http://localhost:3000/project', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: projectName,
            tasks: []
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(`Создан проект: ${data.name}`);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

loadProject('3'); // Пример загрузки проекта с ID 2
