// Show .task-list if not empty
function checkIfEmpty(){
    let todoBox = document.querySelectorAll(".task-list");
    todoBox.forEach(box => {
        if (box.children.length > 0) {
            box.classList.add("active");
        } else {
            box.classList.remove("active");
        }
    });
}

// Create new to-do item
async function createListItem(taskName, taskID) {
    // Helper function to create elements with attributes
    function createElement(tag, classes = [], attributes = {}) {
        let element = document.createElement(tag);
        classes.forEach(cls => element.classList.add(cls));
        Object.keys(attributes).forEach(attr => element.setAttribute(attr, attributes[attr]));
        return element;
    }
    // Create elements using the helper function
    let newCheck = createElement("a", ["task-todo__check"], { "data-title": "Done" });
    let newEditCta = createElement("a", ["task-todo__edit"], { "data-title": "Edit" });
    let newDeleteCta = createElement("a", ["task-todo__delete"], { "data-title": "Delete" });
    let newEditWrapper = createElement("div", ["task-todo--edit-wrapper"]);
    let newInput = createElement("input", [], {
        type: "text",
        name: "list-item",
        readOnly: true,
        value: taskName,
        title: taskName,
    });
    let newInputWrapper = createElement("div", ["task-todo"], { "data-content": taskID });
    // append everyting together
    newInputWrapper.append(newCheck, newInput, newEditWrapper);
    newEditWrapper.append(newEditCta, newDeleteCta);
    todoList.prepend(newInputWrapper);
    checkIfEmpty();
}

// Create new done item
function createDoneItem(doneItem, itemId, itemDate) {
    let date = new Date(itemDate);
    const readableDate = `Fineshed at ${date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })} at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}`;
    let itemDone = document.createElement("p");
    itemDone.setAttribute("data-title", readableDate)
    itemDone.textContent = doneItem;
    doneList.prepend(itemDone); // append new item into done-list
}

function loginCheck(){
    let session = document.querySelector("body.session-active");
    if(session){
        return true;
    } else {
        return false;
    }
}

function showMessage(selector, duration = 4500) {
    const message = document.querySelector(selector);

    if (!message) {
        console.error(`Element not found for selector: ${selector}`);
        return;
    }

    // Add the active class
    message.classList.add('active');

    // Set a timeout to remove the active class
    const timeout = setTimeout(() => {
        message.classList.remove('active');
    }, duration);

    // Remove the active class immediately on click
    const handleClick = () => {
        clearTimeout(timeout);
        message.classList.remove('active');
        message.removeEventListener('click', handleClick); // Clean up listener
    };

    message.addEventListener('click', handleClick);
}

function loginError(){
    showMessage('.login-warning');
}

function shortPassword() {
    showMessage('#passwordShort');
}

function simplePassword() {
    showMessage('#passwordSimple');
}

// Check if user is logged in


