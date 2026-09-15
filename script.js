const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearCompleted = document.getElementById("clearCompleted");
const filters = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskCount() {
    const activeTasks = tasks.filter(task => !task.completed).length;

    taskCount.textContent =
        activeTasks === 1
            ? "1 task left"
            : `${activeTasks} tasks left`;
}

function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task";

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <input 
                type="checkbox" 
                ${task.completed ? "checked" : ""}
            >

            <span>${escapeHTML(task.text)}</span>

            <button class="delete-button">
                🗑️
            </button>
        `;

        const checkbox = li.querySelector("input");

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const deleteButton = li.querySelector(".delete-button");

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            renderTasks();
        });

        taskList.appendChild(li);
    });

    updateTaskCount();
}

function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    renderTasks();
}

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

addButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

filters.forEach(filter => {
    filter.addEventListener("click", () => {
        filters.forEach(button => {
            button.classList.remove("active");
        });

        filter.classList.add("active");

        currentFilter = filter.dataset.filter;

        renderTasks();
    });
});

clearCompleted.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    renderTasks();
});

renderTasks();
