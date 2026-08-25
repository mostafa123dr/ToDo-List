
const addTaskName = document.getElementById("addTaskName");
const taskName = document.getElementById("taskName");
const submit = document.getElementById("submit");
const tasksTable = document.getElementById("tasks");
const openTasks = document.getElementById("openTasks");
const totalTasks = document.getElementById("totalTasks");
const clearClosedTasks = document.getElementById("clearClosedTasks");
const search = document.getElementById("search");
let tasks = [];
let id;
let searchBy = "all";

loadTasks(showTasks);

addTaskName.addEventListener("submit" , event => {

    event.preventDefault();

    if(taskName.value === ""){
        window.alert("Task cant be empty!");
    }
    else{

        const task = {id : id++, toDo : taskName.value, isDone : false};
        tasks.push(task);
        showTasks();
        saveTasks();
        taskName.value = "";
    }


});

tasksTable.addEventListener("click" , event => {

    if(event.target.classList.contains("deletTask")){
        const div = event.target.closest(".task");
        const id = Number(div.dataset.id);
        const line = div.nextElementSibling;

        tasks = tasks.filter( task => task.id !== id);

        div.remove();
        line.remove();
        showTasks();
        saveTasks();
    }

});

tasksTable.addEventListener("change" , event => {
    const div = event.target.closest(".task");
    const id = Number(div.dataset.id);
    const p = div.querySelector("p");
    p.classList.toggle("done");

    const index = tasks.findIndex(task => task.id === id)
    tasks[index].isDone = event.target.checked;

    showTasks();
    saveTasks();
});

search.addEventListener("click" , event => {
    if(event.target.tagName === "BUTTON"){
        searchBy = event.target.id;

        const searchBtns = search.querySelectorAll("button");
        searchBtns.forEach( button => {
            button.classList.remove("active");
        });
        event.target.classList.toggle("active");

        showTasks();
        saveTasks();
    }
});

function addTask(task , index){
    const div = document.createElement("div");
    div.classList.add("task");
    div.dataset.id = task.id;

    const span = document.createElement("span");
    span.textContent = `${String(index).padStart(3, "0")}`;

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = task.isDone;

    const p = document.createElement("p");
    p.textContent = `${task.toDo}`;
    if(task.isDone){
        p.classList.add("done");
    }

    const button = document.createElement("button");
    button.classList.add("deletTask");
    button.textContent = "x";

    div.append(span , input , p , button);

    tasksTable.appendChild(div);

    const line = document.createElement("div");
    line.classList.add("line");
    tasksTable.appendChild(line);
}

function showTasks() {

    if(tasks.length === 0){
        tasksTable.innerHTML = `<p id="placehold">No entries yet. Write your first line above.</p>`;
    }
    else{
        tasksTable.innerHTML = "";
        const visibleTasks = getTasksToShow();
        visibleTasks.forEach( (task , index) => {
            addTask(task , index+1);
        });
    }

    openTasks.textContent = `${tasks.filter(task => !task.isDone).length} open`;
    totalTasks.textContent = `${tasks.length} total`;

}

function getTasksToShow() {
    if(searchBy === "open") return tasks.filter( task => !task.isDone);
    if(searchBy === "closed") return tasks.filter( task => task.isDone);
    return tasks;
}

clearClosedTasks.onclick = function() {
    tasks = tasks.filter(task => !task.isDone);
    showTasks();
    saveTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("id" , JSON.stringify(id));
}

function loadTasks(callback) {
    const savedTasks = localStorage.getItem("tasks");
    const savedId = localStorage.getItem("id");

    if(savedTasks){
        tasks = JSON.parse(savedTasks);

    }
    if(savedId){
        id = JSON.parse(savedId);
    }
    else{
        id = 1;
    }

    callback();
}
