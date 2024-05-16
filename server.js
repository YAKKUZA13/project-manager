const express = require('express'); // Импортируем модуль Express для создания веб-сервера
const fs = require('fs'); // Импортируем модуль fs для работы с файловой системой
const app = express(); // Создаем приложение Express
const PORT = 3000; // Устанавливаем порт, на котором будет работать сервер

app.use(express.json()); // Добавляем middleware для парсинга JSON в теле запросов
app.use(express.static('public'));
let data = JSON.parse(fs.readFileSync('./data.json', 'utf8')); // Читаем и парсим JSON файл с данными проектов

app.get('/projects/:id', (req, res) => {
    // Маршрут для получения проекта по ID
    const projectId = req.params.id; // Получаем ID проекта из параметров URL
    const project = data.projects.find(proj => proj.id === projectId); // Ищем проект с указанным ID
    if (project) {
        res.json(project); // Если проект найден, отправляем его данные в формате JSON
    } else {
        res.status(404).send('Проект не найден'); // Если проект не найден, отправляем статус 404
    }
});

app.post('/projects', (req, res) => {
    // Маршрут для создания нового проекта
    const newProject = req.body; // Получаем данные нового проекта из тела запроса
    newProject.id = (data.projects.length + 1).toString(); // Генерируем ID для нового проекта
    newProject.tasks = []; // Инициализируем пустой массив задач для нового проекта
    data.projects.push(newProject); // Добавляем новый проект в массив проектов

    // Записываем обновленные данные в файл
    fs.writeFile('./data.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            res.status(500).send('Ошибка при сохранении проекта'); // Если произошла ошибка при записи файла, отправляем статус 500
        } else {
            res.status(201).send('Проект создан'); // Если файл успешно записан, отправляем статус 201
        }
    });
});

app.post('/project/:id/task', (req, res) => {
    // Маршрут для обновления статуса задачи
    const { taskId, completed } = req.body; // Получаем ID задачи и статус выполнения из тела запроса
    const project = data.projects.find(p => p.id === req.params.id); // Ищем проект с указанным ID
    if (project) {
        const task = project.tasks.find(t => t.id === taskId); // Ищем задачу с указанным ID в проекте
        if (task) {
            task.completed = completed; // Обновляем статус выполнения задачи
            fs.writeFileSync('./data.json', JSON.stringify(data, null, 2)); // Записываем обновленные данные в файл
            res.send('Задача обновлена'); // Отправляем ответ, что задача обновлена
        } else {
            res.status(404).send('Задача не найдена'); // Если задача не найдена, отправляем статус 404
        }
    } else {
        res.status(404).send('Проект не найден'); // Если проект не найден, отправляем статус 404
    }
});

app.post('/project/:id/tasks', (req, res) => {
    // Маршрут для добавления новой задачи в проект
    const { description } = req.body; // Получаем описание новой задачи из тела запроса
    const project = data.projects.find(p => p.id === req.params.id); // Ищем проект с указанным ID
    if (project) {
        const newTask = {
            id: '_' + Math.random().toString(36).substr(2, 9), // Генерируем уникальный ID для новой задачи
            description: description, // Устанавливаем описание задачи
            completed: false // Устанавливаем статус выполнения задачи как false
        };
        project.tasks.push(newTask); // Добавляем новую задачу в массив задач проекта
        fs.writeFileSync('./data.json', JSON.stringify(data, null, 2)); // Записываем обновленные данные в файл
        res.status(201).json(newTask); // Отправляем ответ с данными новой задачи и статусом 201
    } else {
        res.status(404).send('Проект не найден'); // Если проект не найден, отправляем статус 404
    }
});

app.delete('/project/:id/task/:taskId', (req, res) => {
    // Маршрут для удаления задачи из проекта
    const project = data.projects.find(p => p.id === req.params.id); // Ищем проект с указанным ID
    if (project) {
        const index = project.tasks.findIndex(t => t.id === req.params.taskId); // Ищем индекс задачи с указанным ID в массиве задач проекта
        if (index > -1) {
            project.tasks.splice(index, 1); // Удаляем задачу из массива задач
            fs.writeFileSync('./data.json', JSON.stringify(data, null, 2)); // Записываем обновленные данные в файл
            res.send('Задача удалена'); // Отправляем ответ, что задача удалена
        } else {
            res.status(404).send('Задача не найдена'); // Если задача не найдена, отправляем статус 404
        }
    } else {
        res.status(404).send('Проект не найден'); // Если проект не найден, отправляем статус 404
    }
});

app.listen(PORT, () => {
    // Запускаем сервер на указанном порту
    console.log(`Server running on port ${PORT}`); // Выводим сообщение о запуске сервера в консоль
});
