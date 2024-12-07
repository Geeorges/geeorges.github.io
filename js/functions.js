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

// Complete list item
function completeListItem() {
    document.querySelectorAll(".input__wrapper").forEach(wrapper => {
        // Clone and replace the check CTA to reset event listeners
        let ctaCheck = wrapper.querySelector(".check__cta");
        ctaCheck.replaceWith(ctaCheck.cloneNode(true));
        ctaCheck = wrapper.querySelector(".check__cta");

        // Add click event listener to the check CTA
        ctaCheck.addEventListener('click', event => {
            event.preventDefault();
            let input = wrapper.querySelector("input");         
            let content = wrapper.getAttribute("data-content").trim();
            
            if (content === ""){ // Done item must have content
                input.setAttribute("requiery", "true");
                alert(" \"Does doing nothing really count as doing something?\" :--) ");
            } else{ 
                input.setAttribute("requiery", "false");

                // Perform actions for a completed item
                createDoneItem(content); // Move item to Done list
                //storeDoneLocalStorageItems(content); // Store item into "Done" local storage
                //deleteFromLocalStorage(content); // Remove item from "To-do" local storage

                wrapper.remove();
                checkIfEmpty();
            }
        });
    });
}

// Remove to-do list item 
/* function removeListItem() {
    let inputWrapper = document.querySelectorAll(".input__wrapper")
    
    inputWrapper.forEach(wrapper => {
        let ctaDelete = wrapper.querySelector(".delete__cta");

        ctaDelete.addEventListener('click', function (event) {
            event.preventDefault();

            let content = wrapper.getAttribute("data-content");
            deleteElement(content);

            //deleteFromLocalStorage(content); // Remove item from LocalStorage

            wrapper.remove();
            checkIfEmpty();
        });
    });
} */

// Edit to-do list item
function editListItem() {
    const inputWrappers = document.querySelectorAll(".input__wrapper");

    inputWrappers.forEach(wrapper => {
        let ctaEdit = wrapper.querySelector(".edit__cta");
        // Clone the button to avoid listener duplication
        ctaEdit.replaceWith(ctaEdit.cloneNode(true));
        ctaEdit = wrapper.querySelector(".edit__cta");

        let input = wrapper.querySelector("input");

        function toggleEditMode() {
            // Toggle the readOnly property
            input.readOnly = !input.readOnly; 
            
            // Toggle button state and edit mode
            if (input.readOnly == false) {
                input.focus();
                input.setSelectionRange(input.value.length, input.value.length);
                // Edit button state
                ctaEdit.classList.add("edit__cta--active");
                ctaEdit.setAttribute("data-title", "OK");
                wrapper.classList.add("editing--active");
                
            } else {             
                // Update the value and data attribute
                input.title = input.value;
                let content = wrapper.getAttribute("data-content");
                //updateEditedLocalStorageItem(content, input.value); //local storage function
                wrapper.setAttribute("data-content", input.value);

                // Edit button state
                ctaEdit.classList.remove("edit__cta--active");
                ctaEdit.setAttribute("data-title", "Edit");
                wrapper.classList.remove("editing--active");
            }
        }

        // Save edited value by hitting enter
        function handleEnterKey(event) {
            if (!input.readOnly && event.key === "Enter") {
                ctaEdit = wrapper.querySelector(".edit__cta");
                toggleEditMode();
                ctaEdit.classList.remove("edit__cta--active");
                ctaEdit.setAttribute("data-title", "Edit");
            }
        }

        // Attach the event listener for the Enter key to each input
        input.addEventListener("keydown", handleEnterKey);

        // Attach the click event listener to the button
        ctaEdit.addEventListener('click', function (event) {
            event.preventDefault();
            toggleEditMode();
            ctaEdit = wrapper.querySelector(".edit__cta");
        });
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

