const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Получение данных проекта
app.get('/project/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  const project = data.projects.find(p => p.id === req.params.id);
  if (project) {
    res.json(project);
  } else {
    res.status(404).send('Проект не найден');
  }
});

// Обновление задачи
app.post('/project/:id/task', (req, res) => {
  const { taskId, completed } = req.body;
  const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  const project = data.projects.find(p => p.id === req.params.id);
  if (project) {
    const task = project.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = completed;
      fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
      res.send('Задача обновлена');
    } else {
      res.status(404).send('Задача не найдена');
    }
  } else {
    res.status(404).send('Проект не найден');
  }
});

// Добавление задачи
app.post('/project/:id/tasks', (req, res) => {
  const { description } = req.body;
  const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  const project = data.projects.find(p => p.id === req.params.id);
  if (project) {
    const newTask = {
      id: '_' + Math.random().toString(36).substr(2, 9),
      description: description,
      completed: false
    };
    project.tasks.push(newTask);
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
    res.status(201).json(newTask);
  } else {
    res.status(404).send('Проект не найден');
  }
});

app.post('/project', (req, res) => {
  const newProject = req.body;
  const data = JSON.parse(fs.readFileSync('data.json', 'utf8'))
  newProject.id = String(data.projects.length + 1);
  data.projects.push(newProject);

  fs.writeFile('./data.json', JSON.stringify(data, null, 2), (err) => {
      if (err) {
          return res.status(500).json({ error: 'Ошибка при сохранении данных.' });
      }
      res.status(201).json(newProject);
  });
});


// Удаление задачи
app.delete('/project/:id/task/:taskId', (req, res) => {
  const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  const project = data.projects.find(p => p.id === req.params.id);
  if (project) {
    const index = project.tasks.findIndex(t => t.id === req.params.taskId);
    if (index > -1) {
      project.tasks.splice(index, 1);
      fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
      res.send('Задача удалена');
    } else {
      res.status(404).send('Задача не найдена');
    }
  } else {
    res.status(404).send('Проект не найден');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
