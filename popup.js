document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const addTaskButton = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");

    // Load tasks from storage
    chrome.storage.sync.get("tasks", function (data) {
        if (data.tasks) {
            data.tasks.forEach(addTaskToUI);
        }
    });

    addTaskButton.addEventListener("click", function () {
        const task = taskInput.value.trim();
        if (task) {
            chrome.storage.sync.get("tasks", function (data) {
                let tasks = data.tasks || [];
                tasks.push(task);
                chrome.storage.sync.set({ "tasks": tasks }, function () {
                    addTaskToUI(task);
                    taskInput.value = "";
                });
            });
        }
    });

    function addTaskToUI(task) {
        const li = document.createElement("li");
        li.textContent = task;
        taskList.appendChild(li);
    }
});
