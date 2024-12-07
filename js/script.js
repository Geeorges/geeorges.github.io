
const todoForm = document.getElementById("todoForm");
const todoList = document.getElementById("todoList");
const ctaAdd = document.getElementById("todoAdd");
const doneList = document.getElementById("doneList");




// Add new to-do item
todoForm.addEventListener('submit', function (event) {
    event.preventDefault();
    let input = document.getElementById("todo-input");

    if ((input.value).trim() === ""){
        event.target.reset();
        input.focus();
    }
    else
    {
        // Get data from input
        let formData = new FormData(event.target);
        let data = Object.fromEntries(formData.entries());
        let todoText = data['todo-input'].trim();
    
        // Save data
        createListItem(todoText);
        //storeTodoItems(todoText); // local storage
        //editListItem();
        //removeListItem();
        //completeListItem();


    
        // Reset form
        event.target.reset();
        input.focus();
    }
});

// Prevent to-do form from submiting
todoList.addEventListener('submit', function (event) {
    event.preventDefault();
});