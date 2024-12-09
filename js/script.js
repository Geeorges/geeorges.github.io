
const todoForm = document.getElementById("todoForm");
const todoList = document.getElementById("todoList");
const ctaAdd = document.getElementById("todoAdd");
const doneList = document.getElementById("doneList");


// Prevent to-do form from submiting
todoList.addEventListener('submit', function (event) {
    event.preventDefault();
});