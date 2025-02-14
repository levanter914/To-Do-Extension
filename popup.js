document.addEventListener("DOMContentLoaded", function () {
    const inputEl = document.getElementById("todo-input");
    const addBtn = document.getElementById("add-btn");
    const todoList = document.getElementById("todo-list");

    let todos = [];

    // Load saved tasks from storage
    chrome.storage.sync.get("todos", function (data) {
        if (data.todos) {
            todos = data.todos;
            render();
        }
    });

    addBtn.addEventListener("click", function () {
        if (inputEl.value.trim() === "") {
            alert("Please enter a task!");
            return;
        }
        todos.push({ title: inputEl.value.trim() });
        inputEl.value = "";
        saveAndRender();
    });

    function saveAndRender() {
        chrome.storage.sync.set({ todos }, render);
    }

    function render() {
        todoList.innerHTML = "";
        todos.forEach((todo, index) => {
            const divEl = document.createElement("div");
            divEl.id = `todo-${index}`;

            const titleEl = document.createElement("h3");
            titleEl.textContent = todo.title;

            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.addEventListener("click", function () {
                editTodo(index);
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", function () {
                deleteTodo(index);
            });

            divEl.appendChild(titleEl);
            divEl.appendChild(editBtn);
            divEl.appendChild(deleteBtn);

            todoList.appendChild(divEl);
        });
    }

    function deleteTodo(index) {
        todos.splice(index, 1);
        saveAndRender();
    }

    function editTodo(index) {
        const taskDiv = document.getElementById(`todo-${index}`);
        taskDiv.innerHTML = `
            <input type="text" id="edit-${index}" value="${todos[index].title}">
            <button id="save-${index}">Save</button>
        `;

        document.getElementById(`save-${index}`).addEventListener("click", function () {
            saveTodo(index);
        });
    }

    function saveTodo(index) {
        const editEl = document.getElementById(`edit-${index}`);
        const newValue = editEl.value.trim();
        if (newValue === "") {
            alert("Task cannot be empty!");
            return;
        }
        todos[index].title = newValue;
        saveAndRender();
    }
});
