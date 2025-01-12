import '../scss/styles.scss';

const todoList = document.getElementById("todoList");

// Prevent to-do form from submiting
todoList.addEventListener('submit', function (event) {
    event.preventDefault();    
});
