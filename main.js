let data = new Date().toLocaleDateString().split(".");
let currentDate = data[2] + "." + data[1] + "." + data[0];
let minDate = data[2] + "-" + data[1] + "-" + data[0];
let taskInput = document.querySelector("#taskInput");
let dateInput = document.querySelector("#dateInput");
// dateInput.min = minDate;
let startMessage = document.querySelector("#startMessage");
let template = document.querySelector("#template").innerHTML;
let taskList = document.querySelector(".taskList");
let x;

document.querySelector("#addTaskButtton").addEventListener("click", addNewTask);
taskInput.addEventListener("keydown", function (e) {
    if (e.code == "Enter") addNewTask();
});

class Task {
    constructor(text, data) {
        this.text = text;
        this.data = data;
        this.isDone = false;
    }
}

let taskDatabaseManagement = {
    arrayTasks: [],

    get allTasks() {
        return this.arrayTasks;
    },

    get notCompletedTasks() {
        return this.arrayTasks.filter(task => task.isDone == false);
    },

    addTask(task) {
        this.arrayTasks.push(task);
        this.savelocalStorage();
    },

    deleteTask(task) {
        let index = this.arrayTasks.indexOf(task);
        this.arrayTasks.splice(index, 1);
        this.savelocalStorage();
    },

    savelocalStyleCompleted(task) {
        let index = this.arrayTasks.indexOf(task);
        this.arrayTasks.splice(index, 1, task);
        this.savelocalStorage();
    },

    savelocalCorrectTask(oldTask, newTask) {
        let index = this.arrayTasks.indexOf(oldTask);
        this.arrayTasks.splice(index, 1, newTask);
        this.savelocalStorage();
    },

    savelocalStorage() {
        localStorage.setItem("tasks", JSON.stringify(this.arrayTasks));
    },

    givlocalStorage() {
        this.arrayTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        this.arrayTasks.forEach(task => createEndShowTasks(task));
    }
}

function addNewTask() {
    if (!taskInput.value) alert("Введите новую задачу");
    if (taskInput.value && dateInput.value) {
        if (!startMessage.hidden) startMessage.hidden = true;
        let newTask = new Task(taskInput.value, dateInput.value);
        taskDatabaseManagement.addTask(newTask);
        taskInput.value = "";
        createEndShowTasks(newTask);
    } 
}

function createEndShowTasks(obj) {
    let renderedHTML = Mustache.render(template, obj);
    taskList.insertAdjacentHTML("beforeend", renderedHTML);
    if (!startMessage.hidden) startMessage.hidden = true;

    document.querySelectorAll(".taskData").forEach(task => {
        if (task.innerHTML < minDate && !task.previousElementSibling) {
            task.style.color = "red";
            task.insertAdjacentHTML("beforebegin", "<div class='alert'></div>");
        }
        if (task.innerHTML > minDate && !task.previousElementSibling) task.insertAdjacentHTML("beforebegin", "<div class='edit'></div>");
    });

    if (obj.isDone) {
        document.querySelectorAll(".task").forEach(task => {
            if (obj.text != task.children[1].textContent) return;
            task.classList.toggle("completed");
            task.style.color = "#339933";
            task.style.border = "2.5px solid rgb(7 185 100)";
            task.firstElementChild.click();

        });
    }

    document.querySelectorAll("#deleteTask, .alert").forEach(task => task.addEventListener("click", function (e) {
        if (e.target.parentElement.previousElementSibling.innerHTML != obj.text) return;
        e.target.parentElement.parentElement.remove();
        taskDatabaseManagement.deleteTask(obj);
    }));

    document.querySelectorAll("#checkbox").forEach(task => task.addEventListener("click", function (e) {
        if (e.target.nextElementSibling.innerHTML != obj.text) return;
        if (!obj.isDone) {
            obj.isDone = true;
            taskDatabaseManagement.savelocalStyleCompleted(obj);
            e.target.parentElement.classList.toggle("completed");
            e.target.parentElement.style.color = "#339933";
            e.target.parentElement.style.border = "2.5px solid rgb(7 185 100)";

        } else {
            obj.isDone = false;
            taskDatabaseManagement.savelocalStyleCompleted(obj);
            e.target.parentElement.classList.toggle("completed");
            e.target.parentElement.style.color = "#19867c";
            e.target.parentElement.style.border = "2.5px solid #00d1bd";
        }
    }));

    document.querySelectorAll(".edit").forEach(task => task.addEventListener("click", function (e) {
        if (!x) {
            x = 1;
            let div = document.createElement("div");
            div.classList.add("divCorrectTask");
            let buttun = document.createElement("div");
            buttun.addEventListener("click", saveInputCorrectTask.bind(obj));
            buttun.classList.add("buttun");
            let inputCorrectTask = document.createElement("input");
            inputCorrectTask.value = obj.text;
            inputCorrectTask.classList.add("inputCorrectTask");
            div.append(inputCorrectTask);
            div.append(buttun);
            e.target.parentElement.previousElementSibling.replaceWith(div);
        }

    }));
}




window.addEventListener("load", function () {
    taskDatabaseManagement.givlocalStorage();
});

document.querySelector("#showAllButtton").addEventListener("click", function (e) {
    taskList.innerHTML = "";
    taskDatabaseManagement.arrayTasks.forEach(task => createEndShowTasks(task));
});
document.querySelector("#showNotCompletedButtton").addEventListener("click", function (e) {
    let notCompletedTasks = taskDatabaseManagement.notCompletedTasks;
    taskList.innerHTML = "";
    notCompletedTasks.forEach(task => createEndShowTasks(task));
});

function saveInputCorrectTask(e) {
    let oldTask = this;
    let newTask = {
        data: oldTask.data,
        isDone: oldTask.isDone,
        text: oldTask.text,
    }
    newTask.text = e.target.previousElementSibling.value;
    taskDatabaseManagement.savelocalCorrectTask(oldTask, newTask);
    location.reload();
}

