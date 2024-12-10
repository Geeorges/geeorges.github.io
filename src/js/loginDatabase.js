import { Client, Account, ID} from "appwrite";


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

    try {
        // Fetch user info
        const user = await account.get();
        console.log("User Label:", user.labels);  // Logs current labels
        console.log("User preferences:", user.prefs); // Logs current preferences

        // Add "basic" label if it's not already present
        if (user.labels && !user.labels.includes("basic")) {
            const updatedLabels = [...user.labels, "basic"];
            
            // Update the user labels (using the correct method)
            const result = await account.updatePrefs({ labels: updatedLabels });
            console.log("Label updated successfully:", result);
        } else {
            console.log("Label 'basic' is already present.");
        }
    } catch (error) {
        console.error("Error fetching user label:", error);
    }
}

getUserLabel(); 


/* 

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('673e5814003a6ffce52d'); // Your project ID

const account = new Account(client);

// Example of creating a new identity (e.g., for Google authentication)
const result = await account.createIdentity(
    'google', // The provider (e.g., 'google', 'facebook', etc.)
    'your_provider_api_key_or_secret' // The API key or secret for the provider (if needed)
);

console.log(result); */