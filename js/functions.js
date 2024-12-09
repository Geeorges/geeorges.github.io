// Show .todo__box if not empty
function checkIfEmpty(){
    let todoBox = document.querySelectorAll(".todo__box");

    todoBox.forEach(box => {
        if (box.children.length > 0) {
            box.classList.add("active");
        } else {
            box.classList.remove("active");
        }
    });
}





// Create new to-do item
function createListItem(taskName, taskID) {
    // Helper function to create elements with attributes
    function createElement(tag, classes = [], attributes = {}) {
        let element = document.createElement(tag);
        classes.forEach(cls => element.classList.add(cls));
        Object.keys(attributes).forEach(attr => element.setAttribute(attr, attributes[attr]));
        return element;
    }

    // Create elements using the helper function
    let newCheck = createElement("a", ["check__cta"], { "data-title": "Done" });
    let newEditCta = createElement("a", ["edit__cta"], { "data-title": "Edit" });
    let newDeleteCta = createElement("a", ["delete__cta"], { "data-title": "Delete" });

    let newEditWrapper = createElement("div", ["edit__wrapper"]);

    let newInput = createElement("input", [], {
        type: "text",
        name: "list-item",
        readOnly: true,
        value: taskName,
        title: taskName,
    });

    let newInputWrapper = createElement("div", ["input__wrapper"], { "data-content": taskID });

    // append everyting together
    newInputWrapper.append(newCheck, newInput, newEditWrapper);
    newEditWrapper.append(newEditCta, newDeleteCta);
    todoList.prepend(newInputWrapper);

    checkIfEmpty();
}

// Create new done item
function createDoneItem(doneItem) {
    // save content into new item
    let itemDone = document.createElement("p");
    itemDone.textContent = doneItem;
    
    // append new item into done-list
    doneList.prepend(itemDone);
}



// Sort items


const desktopQuery = window.matchMedia('(any-hover: hover)');

if (desktopQuery.matches) {
    const sortableList = document.getElementById('todoList');

    Sortable.create(sortableList, {
        animation: 150,
        easing: "cubic-bezier(0.7, 0, 0.3, 1)",
        ghostClass: "ghost" // Class applied to the placeholder position
    });
    
}

