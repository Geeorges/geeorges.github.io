import { Client, Account, Users, ID } from "appwrite";


// Delete session

async function deleteSession() {
    const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('673e5814003a6ffce52d'); // Your project ID

    const account = new Account(client);

    try {
        // Delete the current session
        await account.deleteSession('current');
        
        console.log("User logged out successfully!");
        
        // Optionally, you can redirect the user or update the UI
        window.location.reload(); // Refresh the page to reflect the logged-out state
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

async function getClient() {
    const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
        .setProject('673e5814003a6ffce52d'); // Your project ID 

    const account = new Account(client);

    try{
        const result = await account.get();
        
        return{
            email: result.email,
            name: result.name
        }
    } catch (error){
        console.error('No active session:', error);
        return null;  // Return null if no session is found
    }
}

async function showClient(){
    const clientData = await getClient();

    if (clientData) {
        const { email, name } = await getClient();
        console.log(email, name);
        let userName = document.querySelector("#userLogin");
        userName.innerHTML = email;

        let signIn = document.querySelector("#userSignIn");
        signIn.remove();

        //
        let body = document.querySelector("body");
        body.classList.add("session-active");
        //

        let showLoginPopupCta = document.querySelector("#userLogin");

        showLoginPopupCta.addEventListener('click', function (event) {
            event.preventDefault();
            const isConfirmed = window.confirm("Are you sure you want to log out?");
            if (isConfirmed) {
                console.log("User logged out!");
                deleteSession();
            } else {
                console.log("Logout canceled.");
            }
        });
    } else{
        let showLoginPopupCta = document.querySelectorAll("#userLogin, #loginPopupClose");

        showLoginPopupCta.forEach(function(loginPopupCta) {
            loginPopupCta.addEventListener('click', function (event) {
                event.preventDefault();
        
                let popup = document.querySelector("#logInPopup");
                popup.classList.toggle("active");
            });
        });
        
        
        let showSignPopupCta = document.querySelectorAll("#userSignIn, #signInPopupClose");
        
        showSignPopupCta.forEach(function(SignPopupCta) {
            SignPopupCta.addEventListener('click', function (event) {
                event.preventDefault();
        
                let popup = document.querySelector("#signInPopup");
                popup.classList.toggle("active");
            });
        });
    }
}

showClient();



// SIGN IN 


async function createNewUser(newEmail, newPass, newUser) {
    try {
        const client = new Client()
            .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
            .setProject('673e5814003a6ffce52d'); // Your project ID
        
        const account = new Account(client);
        
        const user = await account.create(
            ID.unique(), 
            newEmail,
            newPass,
            newUser
        );
        console.log('Super');
        
    } catch (error){
        console.error('Error creating new user:', error);
    }
}

let signIn = document.querySelector("#signInPopup");

signIn.addEventListener('submit', function (event) {
    event.preventDefault();

    let formData = new FormData(event.target);
    let data = Object.fromEntries(formData.entries());
    let newUser = data['username'].trim();
    let newPass = data['password'].trim();
    let newEmail = data['email'].trim();

    createNewUser(newEmail, newPass, newUser);
});



// LOG IN




async function loginFunction(email, password) {
    try {
        const client = new Client()
            .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
            .setProject('673e5814003a6ffce52d'); // Your project ID
        
        const account = new Account(client);
        
        const session = await account.createEmailPasswordSession(email, password);

        const prefs = await account.getPrefs();
        console.log(prefs);

       /*  const result = await account.updatePrefs({ label: "basic" });
        console.log("Label updated successfully:", result); */

        console.log(prefs);

        // On success, refresh the page
        window.location.reload();  // Refreshes the page after successful login


    } catch (error){
        console.error('Error creating new user:', error);
    }
}



let logIn = document.querySelector("#logInPopup");

logIn.addEventListener('submit', function (event) {
    event.preventDefault();

    let formData = new FormData(event.target);
    let data = Object.fromEntries(formData.entries());
    let email = data['email'].trim();
    let password = data['password'].trim();

    loginFunction(email, password);
});













async function getUserLabel() {
    const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
        .setProject('673e5814003a6ffce52d'); // Your project ID
    
    const account = new Account(client);
    const users = new Users(client); // Create an instance of the Users API
    
    try {
        // Fetch the user information
        const user = await account.get();
        console.log("User Label:", user.labels);  // Logs current labels
        console.log("User preferences:", user.prefs); // Logs current preferences

        // Fetch user preferences
        let prefs = await account.getPrefs();
        console.log("User Preferences:", prefs);

        // Check if the user has labels and if the label is not already in the array
        if (user.labels && !user.labels.includes("basic")) {
            // Add "basic" label if it's not already present
            const updatedLabels = [...user.labels, "basic"];
            
            // Use the Users API to update the user labels
            const result = await users.update(user.$id, { labels: updatedLabels });
            console.log("Label updated successfully:", result);
        } else {
            console.log("Label 'basic' is already present.");
        }

    } catch (error) {
        console.error("Error fetching user label:", error);
    }
}

getUserLabel();
