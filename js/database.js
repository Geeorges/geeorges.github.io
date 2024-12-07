import { Client, Databases, ID } from 'appwrite';


const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('673e5814003a6ffce52d'); // Your project ID

const databases = new Databases(client);

async function fetchDocuments() {
    try {
        const results = await databases.listDocuments(
            '673e5848002973075c76', // databaseId
            '673e5a6200247fcdc7b5', // collectionId
            [] // queries (optional)
        );

        // 
        results.documents.forEach(result => {
            let taskName = result.Task;
            let taskID = result.$id;
            createListItem(taskName, taskID);
        });
    } catch (error) {
        console.error('Error fetching documents:', error);
    }
}

fetchDocuments();


function addDocuments(inputText) {
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
        }, function (error) {
            console.error('Error creating document:', error);
        });

    } catch (error) {
        console.error("Error in addDocuments function:", error);
    }
}


/* 
async function deleteElement(idToDelete){
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
        addDocuments(todoText);
        //createListItem(todoText);


        // Reset form
        event.target.reset();
        input.focus();
    }
});



