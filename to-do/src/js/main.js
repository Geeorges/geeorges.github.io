import '../scss/styles.scss';

const todoList = document.getElementById("todoList");

// Prevent to-do form from submiting
todoList.addEventListener('submit', function (event) {
    event.preventDefault();    
});

// Show .task-list if not empty
export function checkIfEmpty(){
    let todoBox = document.querySelectorAll(".task-list");
    todoBox.forEach(box => {
        if (box.children.length > 0) {
            box.classList.add("active");
        } else {
            box.classList.remove("active");
        }
    });
}