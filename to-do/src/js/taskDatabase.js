import { Client, Databases, ID, Messaging, Query } from 'appwrite';


// INITIALIZE DB

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('673e5814003a6ffce52d'); // Your project ID

const databases = new Databases(client);


//
// FUNCTIONS


async function fetchTodoDocuments() {
    try {
        const results = await databases.listDocuments(
            '673e5848002973075c76', // databaseId
            '673e5a6200247fcdc7b5', // collectionId
            [
                Query.equal('Done', false),
            ] 
        );

        // 
        results.documents.forEach(result => {
            let taskName = result.Task;
            let taskId = result.$id;
            let taskUpdated = result.$updatedAt;
            createListItem(taskName, taskId, taskUpdated);
        });
        removeListItem();
        completeListItem();
        editListItem();
    } catch (error) {
        console.error('Error fetching documents:', error);
    }
}

async function fetchDoneDocuments() {
    try {
        const results = await databases.listDocuments(
            '673e5848002973075c76', // databaseId
            '673e5a6200247fcdc7b5', // collectionId
            [
                Query.equal('Done', true),
                Query.orderAsc('$updatedAt'),
            ] 
        );

        results.documents.forEach(result => {
            let taskName = result.Task;
            let taskId = result.$id;
            let taskUpdated = result.$updatedAt;
            createDoneItem(taskName, taskId, taskUpdated);
        });

        checkIfEmpty();

    } catch (error) {
        console.error('Error fetching documents:', error);
    }
}

async function addDocuments(inputText) {
    try {
        const session = await loginCheck(); // Await inside async callback
        if (session) {
            try {
                // Generate unique ID using ID.unique() for the document
                const documentId = ID.unique();
        
                // Create a new document in the specified collection
                const promise = databases.createDocument(
                    '673e5848002973075c76', // databaseId
                    '673e5a6200247fcdc7b5', // collectionId
                    documentId, // Unique document ID
                    {
                        Task: inputText // Document fields (you can add more fields here)
                    }
                );
        
                promise.then(function (response) {
                    console.log('Document created successfully:', response);
                    createListItem(response.Task, response.$id);
                    removeListItem();
                    completeListItem();
                    editListItem();
        
                }, function (error) {
                    console.error('Error creating document:', error);
                });
        
            } catch (error) {
                console.error("Error in addDocuments function:", error);
            }
        } else {
           loginError();
        }
    }
    catch (error){

    }
}

async function markAsDone(contentId) {
    try {

        // Create a new document in the specified collection
        const promise = databases.updateDocument(
            '673e5848002973075c76', // databaseId
            '673e5a6200247fcdc7b5', // collectionId
            contentId,
            {
                Done: true // Document fields (you can add more fields here)
            }
        );

        promise.then(function (response) {
            console.log('Document created successfully:', response);
            createDoneItem(response.Task, response.$id, response.$updatedAt);
            checkIfEmpty();
            removeListItem();

        }, function (error) {
            console.error('Error in marking element as done:', error);
        });

    } catch (error) {
        console.error("Error in markAsDone function:", error);
    }
}

async function editTask(contentId, contentValue) {
    try {
      
        // Create a new document in the specified collection
        const promise = databases.updateDocument(
            '673e5848002973075c76', // databaseId
            '673e5a6200247fcdc7b5', // collectionId
            contentId,
            {
                Task: contentValue
            }
        );
        
        promise.then(function (response) {
            console.log('Document created successfully:', response);
            
        }, function (error) {
            console.error('Error in editing element:', error);
        });
    
    } catch (error) {
        console.error("Error in editing function:", error);
    }
}


//
// MAIN CODE 

fetchTodoDocuments();
fetchDoneDocuments();

async function deleteElement(iDToDelete){
    try{
        const result = await databases.deleteDocument(
            '673e5848002973075c76', // databaseId
            '673e5a6200247fcdc7b5', // collectionId
            iDToDelete // documentId
        );  
    } catch (error) {
        console.error("Error in deleteElement function:", error);
    }
}

function removeListItem() {
    let inputWrapper = document.querySelectorAll(".task-todo")
    
    inputWrapper.forEach(wrapper => {
        let ctaDelete = wrapper.querySelector(".task-todo__delete");
        
        ctaDelete.addEventListener('click', async event => {
            event.preventDefault();

            try {
                const session = await loginCheck(); // Await inside async callback
                if (session) {
                    let contentId = wrapper.getAttribute("data-content");
                    deleteElement(contentId);
                    
                    wrapper.remove();
                    checkIfEmpty();
                } else {
                    loginError();
                }
            } catch (error) {
                console.error("Error during session check:", error);
            }
        });
    });
}

// Add new to-do item
todoForm.addEventListener('submit', function (event) {
    event.preventDefault();
    let input = document.getElementById("newTask");

    if ((input.value).trim() === ""){
        event.target.reset();
        input.focus();
    }
    else
    {
        // Get data from input
        let formData = new FormData(event.target);
        let data = Object.fromEntries(formData.entries());
        let todoText = data['newTask'].trim();
    
        // Save data
        addDocuments(todoText);
        removeListItem();

        // Reset form
        event.target.reset();
        input.focus();
    }
});




// Complete list item
async function completeListItem() {
    document.querySelectorAll(".task-todo").forEach(wrapper => {
        // Clone and replace the check CTA to reset event listeners
        let ctaCheck = wrapper.querySelector(".task-todo__check");
        ctaCheck.replaceWith(ctaCheck.cloneNode(true));
        ctaCheck = wrapper.querySelector(".task-todo__check");

        // Add click event listener to the check CTA
        ctaCheck.addEventListener('click', async event => { // Make the callback async
            event.preventDefault();
            let input = wrapper.querySelector("input");
            let content = wrapper.getAttribute("data-content").trim();

            try {
                const session = await loginCheck(); // Await inside async callback
                if (session) {
                    if (content === "") { // Done item must have content
                        input.setAttribute("requiery", "true");
                        alert(" \"Does doing nothing really count as doing something?\" :--) ");
                    } else {
                        input.setAttribute("requiery", "false");

                        let contentId = wrapper.getAttribute("data-content");
                        markAsDone(contentId);

                        wrapper.remove();
                        checkIfEmpty();
                    }
                } else {
                    loginError();
                }
            } catch (error) {
                console.error("Error during session check:", error);
            }
        });
    });
}






// Edit to-do list item
async function editListItem() {
    const inputWrappers = document.querySelectorAll(".task-todo");

    inputWrappers.forEach(wrapper => {
        let ctaEdit = wrapper.querySelector(".task-todo__edit");
        // Clone the button to avoid listener duplication
        ctaEdit.replaceWith(ctaEdit.cloneNode(true));
        ctaEdit = wrapper.querySelector(".task-todo__edit");

        let input = wrapper.querySelector("input");

        function toggleEditMode() {
            // Toggle the readOnly property
            input.readOnly = !input.readOnly; 
            
            // Toggle button state and edit mode
            if (input.readOnly == false) {
                input.focus();
                input.setSelectionRange(input.value.length, input.value.length);
                // Edit button state
                ctaEdit.classList.add("task-todo__edit--active");
                ctaEdit.setAttribute("data-title", "OK");
                wrapper.classList.add("editing--active");
                
            } else {             
                // Update the value and data attribute
                input.title = input.value;
                let contentId = wrapper.getAttribute("data-content");
                
                editTask(contentId, input.title)

                // Edit button state
                ctaEdit.classList.remove("task-todo__edit--active");
                ctaEdit.setAttribute("data-title", "Edit");
                wrapper.classList.remove("editing--active");
            }
        }

        // Save edited value by hitting enter
        function handleEnterKey(event) {
            if (!input.readOnly && event.key === "Enter") {
                ctaEdit = wrapper.querySelector("task-todo__edit");
                toggleEditMode();
                ctaEdit.classList.remove("task-todo__edit--active");
                ctaEdit.setAttribute("data-title", "Edit");
            }
        }

        // Attach the event listener for the Enter key to each input
        input.addEventListener("keydown", handleEnterKey);

        // Attach the click event listener to the button
        ctaEdit.addEventListener('click', async event => {
            event.preventDefault();
            try {
                const session = await loginCheck(); // Await inside async callback
                if (session) {
                    toggleEditMode();
                    ctaEdit = wrapper.querySelector(".task-todo__edit");
                } else {
                    loginError();
                }
            } catch (error) {
                console.error("Error during session check:", error);
            }
        });
    });
}