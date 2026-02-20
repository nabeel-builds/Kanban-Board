let tasksData = {}

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const columns = [todo, progress, done]
let dragElement = null;

function addTask(title, desc, column) {
    const div = document.createElement("div")

    div.classList.add("task")
    div.setAttribute("draggable", "true")

    div.innerHTML = `
    <h2>${title}</h2>
    <p>${desc}</p>
    <button>Delete</button>
    `

    column.appendChild(div)

    div.addEventListener("drag", function (e) {
        dragElement = div;
    })

    const deleteButton = div.querySelector("button")
    deleteButton.addEventListener("click", function () {
        div.remove()
        updateTaskCount()
    })

    return div;
}

function updateTaskCount() {
    columns.forEach(function (col) {
        const tasks = col.querySelectorAll(".task");
        const count = col.querySelector(".right");

        tasksData[col.id] = Array.from(tasks).map(function (t) {
            return {
                title: t.querySelector("h2").innerText,
                desc: t.querySelector("p").innerText
            }
        })
        localStorage.setItem("tasks", JSON.stringify(tasksData));
        count.innerText = tasks.length
    })
}

if (localStorage.getItem("tasks")) {

    const data = JSON.parse(localStorage.getItem("tasks"));

    for (const col in data) {
        const column = document.querySelector(`#${col}`);
        data[col].forEach(function (task) {
            addTask(task.title, task.desc, column)
        })
    }

    updateTaskCount()
}

const tasks = document.querySelectorAll(".task");

tasks.forEach(function (task) {

    task.addEventListener("drag", function (e) {
        dragElement = task

    })
})



function addDragEventsOnColumn(column) {

    column.addEventListener("dragenter", function (e) {
        e.preventDefault();
        column.classList.add("hover-over")
    })

    column.addEventListener("dragleave", function (e) {
        e.preventDefault();
        column.classList.remove("hover-over")
    })

    column.addEventListener("dragover", function (e) {
        e.preventDefault();
    })

    column.addEventListener("drop", function (e) {
        e.preventDefault();
        column.appendChild(dragElement);
        column.classList.remove("hover-over")

        updateTaskCount()
    })

}

addDragEventsOnColumn(todo)
addDragEventsOnColumn(progress)
addDragEventsOnColumn(done)

// Modal Related Logic

const toggleModalButton = document.querySelector("#toggle-modal")
const modal = document.querySelector(".modal")
const modalBg = document.querySelector(".modal .bg")
const addTaskButton = document.querySelector("#add-new-task")

toggleModalButton.addEventListener("click", function () {
    modal.classList.toggle("active")
})

modalBg.addEventListener("click", function () {
    modal.classList.remove("active")
})


addTaskButton.addEventListener("click", function () {

    const taskTitle = document.querySelector("#task-title-input").value
    const taskDesc = document.querySelector("#task-desc-input").value

    addTask(taskTitle, taskDesc, todo)
    updateTaskCount()
    modal.classList.remove("active")

    document.querySelector("#task-title-input").value = ""
    document.querySelector("#task-desc-input").value = ""

})