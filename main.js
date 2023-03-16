let taskInput = document.querySelector("#taskInput");
let startMessage = document.querySelector("#startMessage");
let template = document.querySelector("#template").innerHTML;
let taskList = document.querySelector(".taskList");

document.querySelector("#addTaskButtton").addEventListener("click", addNewTask);
taskInput.addEventListener("keydown", function (e) {
    if (e.code == "Enter") addNewTask();
})

class Task {
    constructor(text) {
        this.text = text;
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

    savelocaStyleCompleted(task) {
        let index = this.arrayTasks.indexOf(task);
        this.arrayTasks.splice(index, 1, task);
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
    if (taskInput.value) {
        if (!startMessage.hidden) startMessage.hidden = true;
        let newTask = new Task(taskInput.value);
        taskDatabaseManagement.addTask(newTask);
        taskInput.value = "";
        createEndShowTasks(newTask);
    } else alert("Введите новую задачу");
}

function createEndShowTasks(obj) {
    let renderedHTML = Mustache.render(template, obj);
    taskList.insertAdjacentHTML("beforeend", renderedHTML);
    if (!startMessage.hidden) startMessage.hidden = true;
    if (obj.isDone) {
        document.querySelectorAll(".task").forEach(task => {
            if (obj.text != task.children[1].textContent) return;
            task.classList.toggle("completed");
            task.firstElementChild.click();
        });       
    }
    document.querySelectorAll("#deleteTask").forEach(task => task.addEventListener("click", function (e) {
        if (e.target.previousElementSibling.innerHTML != obj.text) return;
        e.target.parentElement.remove();
        taskDatabaseManagement.deleteTask(obj);
    }));
    document.querySelectorAll("#checkbox").forEach(task => task.addEventListener("click", function (e) {
        if (e.target.nextElementSibling.innerHTML != obj.text) return;
        if (!obj.isDone) {
            obj.isDone = true;
            taskDatabaseManagement.savelocaStyleCompleted(obj);
            e.target.parentElement.classList.toggle("completed");

        } else {
            obj.isDone = false;
            taskDatabaseManagement.savelocaStyleCompleted(obj);
            e.target.parentElement.classList.toggle("completed");
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
    let notCompletedTasks = taskDatabaseManagement.arrayTasks.notCompletedTasks;
    notCompletedTasks.forEach(task => createEndShowTasks(task));
});




// let taskInput = document.querySelector("#taskInput");
// let startMessage = document.querySelector("#startMessage");
// let template = document.querySelector("#template").innerHTML;
// let taskList = document.querySelector(".taskList");

// document.querySelector("#addTaskButtton").addEventListener("click", addNewTask);
// taskInput.addEventListener("keydown", function (e) {
//     if (e.code == "Enter") addNewTask();
// })

// class Task {
//     constructor(text) {
//         this.text = text;
//         this.isDone = false;
//     }
// }

// let taskDatabaseManagement = {
//     arrayTasks: [],

//     get allTasks() {
//         return this.arrayTasks;
//     },

//     get notCompletedTasks() {
//         return this.arrayTasks.filter(task => task.isDone == false);
//     },

//     addTask(task) {
//         this.arrayTasks.push(task);
//         this.savelocalStorage();
//     },

//     deleteTask(task) {
//         let index = this.arrayTasks.indexOf(task);
//         this.arrayTasks.splice(index, 1);
//         this.savelocalStorage();
//     },

//     savelocaStyleCompleted(task) {
//         let index = this.arrayTasks.indexOf(task);
//         this.arrayTasks.splice(index, 1, task);
//         this.savelocalStorage();
//     },

//     savelocalStorage() {
//         localStorage.setItem("tasks", JSON.stringify(this.arrayTasks));
//     },

//     givlocalStorage() {
//         this.arrayTasks = JSON.parse(localStorage.getItem("tasks")) || [];
//         this.arrayTasks.forEach(task => createEndShowTasks(task));
//     }
// }

// function addNewTask() {
//     if (taskInput.value) {
//         if (!startMessage.hidden) startMessage.hidden = true;
//         let newTask = new Task(taskInput.value);
//         taskDatabaseManagement.addTask(newTask);
//         taskInput.value = "";
//         createEndShowTasks(newTask);
//     } else alert("Введите новую задачу");
// }

// function createEndShowTasks(obj) {
//     let renderedHTML = Mustache.render(template, obj);
//     taskList.insertAdjacentHTML("afterend", renderedHTML);
//     if (obj.isDone) {
//         document.querySelector(".task").classList.toggle("completed");
//         document.querySelector("#checkbox").click();
//     }
//     document.querySelector("#deleteTask").addEventListener("click", function (e) {
//         e.target.parentElement.remove();
//         taskDatabaseManagement.deleteTask(obj);
//     }), obj;
//     document.querySelector("#checkbox").addEventListener("click", function (e) {
//         if (!obj.isDone) {
//             obj.isDone = true;
//             taskDatabaseManagement.savelocaStyleCompleted(obj);
//             e.target.parentElement.classList.toggle("completed");

//         } else {
//             obj.isDone = false;
//             taskDatabaseManagement.savelocaStyleCompleted(obj);
//             e.target.parentElement.classList.toggle("completed");
//         }
//     }), obj;
// }

// window.addEventListener("load", function () {
//     taskDatabaseManagement.givlocalStorage();
// });

// document.querySelector("#showAllButtton").addEventListener("click", function (e) {
//     taskList.innerHTML = "";
//     taskDatabaseManagement.arrayTasks.forEach(task => createEndShowTasks(task));
// });
// document.querySelector("#showNotCompletedButtton").addEventListener("click", function (e) {
//     let notCompletedTasks = taskDatabaseManagement.arrayTasks.notCompletedTasks;
//     notCompletedTasks.forEach(task => createEndShowTasks(task));
// });