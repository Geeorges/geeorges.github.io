/*  local storage */
let itemsTodo = localStorage.getItem("items-todo") ? JSON.parse(localStorage.getItem("items-todo")) : [];
let itemsDone = localStorage.getItem("items-done") ? JSON.parse(localStorage.getItem("items-done")) : [];

// store to-do items
function storeTodoItems(value) {
    // Push the new item into the array
    itemsTodo.push(value);
    // Optionally, save the updated array back to localStorage
    localStorage.setItem("items-todo", JSON.stringify(itemsTodo));
}

// store done items
function storeDoneLocalStorageItems(value) {
    // Push the new item into the array
    itemsDone.push(value);
    // Save the updated array back to localStorage
    localStorage.setItem("items-done", JSON.stringify(itemsDone));
}

//
function updateEditedLocalStorageItem(editedItem, newItem){
    const itemsTodo = JSON.parse(localStorage.getItem("items-todo")) || [];

    const index = itemsTodo.indexOf(editedItem);
    if (index !== -1) {
        // Replace the old item with the new item
        itemsTodo[index] = newItem;
        // Save the updated array back to localStorage
        localStorage.setItem("items-todo", JSON.stringify(itemsTodo));
        // Log the updated item
        //console.log("Updated item: " + editedItem + " to " + newItem);
    } else {
        console.log("Item not found: " + editedItem);
    }
}

// Remove to-do item from localStorage
function deleteFromLocalStorage(itemToDelete) {
    // Retrieve existing items from localStorage or initialize an empty array
    let itemsTodo = localStorage.getItem("items-todo") ? JSON.parse(localStorage.getItem("items-todo")) : [];
    // Filter out the item to delete
    itemsTodo = itemsTodo.filter(item => item.trim() !== itemToDelete);
    // Save the updated array back to localStorage
    localStorage.setItem("items-todo", JSON.stringify(itemsTodo));
}

// Load items from localStorage
function loadLocalStorageItems(){
   // Retrieve items from localStorage or initialize as empty arrays
   const itemsTodo = JSON.parse(localStorage.getItem("items-todo")) || [];
   const itemsDone = JSON.parse(localStorage.getItem("items-done")) || [];

    itemsTodo.forEach(item => {
        createListItem(item);
    });
    
    itemsDone.forEach(item => {
        createDoneItem(item);
    });

    // Add event listeners once after loading items
    editListItem();
    removeListItem();
    completeListItem();

    checkIfEmpty();
}
loadLocalStorageItems();


// Reset to-do, done list, localStorage
let ctaReset = document.querySelector("#ctaReset");

ctaReset.addEventListener('click', function (event) {
    event.preventDefault();
    localStorage.clear();

    let todoItems = document.querySelectorAll(".input__wrapper");

    todoItems.forEach(item => {
        item.remove();
    });

    let doneItems = document.querySelectorAll(".todo__box--done p");

    doneItems.forEach(item => {
        item.remove();
    });
    
    checkIfEmpty();
});