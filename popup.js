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
            divEl.className = "todo-item";
            divEl.id = `todo-${index}`;

            const textEl = document.createElement("span");
            textEl.className = "todo-text";
            textEl.textContent = todo.title;

            const editBtn = document.createElement("button");
            editBtn.className = "icon-btn";
            editBtn.innerHTML = `<img src="icons/edit.png" alt="Edit" class="icon" width="10" height="10">`;
            editBtn.addEventListener("click", function () {
                editTodo(index);
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "icon-btn";
            deleteBtn.innerHTML = `<img src="icons/delete.png" alt="Delete" class="icon" width="10" height="10">`;
            deleteBtn.addEventListener("click", function () {
                deleteTodo(index);
            });

            divEl.appendChild(textEl);
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
            <button class="icon-btn" id="save-${index}">
                <img src="icons/save.png" alt="Save" class="icon" width="10" height="10">
            </button>
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
