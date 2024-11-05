class Task {
    constructor(id, description) {
        this.id = id;
        this.description = description;
    }
}

class TaskManager {
    constructor() {
        this.tasks = [];
        this.ascending = true;
        this.currentId = 0;
    }

    addTask(description) {
        const task = new Task(this.currentId, description);
        this.tasks.push(task);
        this.renderTasks();
        this.currentId++;
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.renderTasks();
    }

    sortTasks() {
        this.tasks.sort((a, b) =>
            this.ascending ? a.description.localeCompare(b.description) :
                b.description.localeCompare(a.description)
        );
        this.ascending = !this.ascending;
        this.renderTasks();
    }

    swapTasks(draggedId, dropTargetId) {
        const draggedIndex = this.tasks.findIndex(task => task.id === parseInt(draggedId));
        const dropTargetIndex = this.tasks.findIndex(task => task.id === parseInt(dropTargetId));

        const [removedTask] = this.tasks.splice(draggedIndex, 1);
        this.tasks.splice(dropTargetIndex, 0, removedTask);

        this.renderTasks();
    }

    renderTasks() {
        const taskList = document.querySelector('.todo-list');
        taskList.style.display = 'block';
        taskList.innerHTML = '';

        if (this.tasks.length > 0) {
            this.tasks.forEach((task) => {
                let li = document.createElement('li');
                li.classList.add('task-item');
                li.draggable = true;
                li.setAttribute('data-id', task.id);

                let taskDiv = document.createElement('div');
                taskDiv.classList.add('task-text');
                taskDiv.textContent = task.description;

                let deleteBtn = document.createElement('button');
                deleteBtn.classList.add('delete-btn');

                let deleteImg = document.createElement('img');
                deleteImg.src = 'images/Group 56.png';
                deleteImg.classList.add('first');
                deleteImg.alt = 'delete';
                deleteBtn.appendChild(deleteImg);

                let deleteImg2 = document.createElement('img');
                deleteImg2.src = 'images/Group 70.png';
                deleteImg2.classList.add('second');
                deleteBtn.appendChild(deleteImg2);

                deleteBtn.onclick = () => this.deleteTask(task.id);

                li.appendChild(taskDiv);
                li.appendChild(deleteBtn);
                taskList.appendChild(li);

                li.addEventListener('dragstart', this.handleDragStart.bind(this));
                li.addEventListener('dragover', this.handleDragOver.bind(this));
                li.addEventListener('drop', this.handleDrop.bind(this));
            });
        } else {
            taskList.style.display = 'none';
        }
    }

    handleDragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.getAttribute('data-id'));
    }

    handleDragOver(event) {
        event.preventDefault();  
    }

    handleDrop(event) {
        event.preventDefault();
        const draggedId = event.dataTransfer.getData('text');
        const dropTargetId = event.target.closest('li').getAttribute('data-id');

        if (draggedId !== dropTargetId) {
            this.swapTasks(draggedId, dropTargetId);
        }
    }
}

class App {
    constructor() {
        this.taskManager = new TaskManager();
    }

    init() {
        const sortBtn = document.querySelector('.sort-btn');
        const sortBtnImg = document.querySelector('.sort-btn img');

        sortBtn.addEventListener('mouseover', () => {
            if (this.taskManager.ascending) {
                sortBtnImg.src = 'images/Group 73.png';
            } else {
                sortBtnImg.src = 'images/Group 91.png';
            }
        });

        sortBtn.addEventListener('mouseout', () => {
            if (this.taskManager.ascending) {
                sortBtnImg.src = 'images/Group 74.png';
            } else {
                sortBtnImg.src = 'images/Group 90.png';
            }
        });

        document.querySelector('.add-btn').addEventListener('click', () => {
            document.querySelector('.delete-container').style.display = 'block';
            const taskInput = document.getElementById('task-input');
            const description = taskInput.value.trim();

            if (description !== "") {
                this.taskManager.addTask(description);
                taskInput.value = "";
            }
        });

        document.querySelector('.delete-btn').addEventListener('click', () => {
            document.querySelector('.delete-container').style.display = 'none';
        });

        document.querySelector('.sort-btn').addEventListener('click', () => this.taskManager.sortTasks());
    }
}

const app = new App();
app.init();
