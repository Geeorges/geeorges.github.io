import { Client, Account, ID} from "appwrite";
import { themeColors } from './colors';

// --------
// Delete session
// --------

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

var colorText = "#fff";


// show name of loged-in user
// toggle .active on login + sign-in popup 
// hide sign-in button when session is active
async function showClient(){
    const clientData = await getClient();

    if (clientData) {
        const { email, name } = clientData;
        console.log(email, name);

        // Get the userName element
        let userName = document.querySelector(".userSignIn");

        // Update the user name and email with the SVG and colorText
        userName.innerHTML = 
        '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#fff"><path d="M480-504.77q-49.5 0-83.21-33.71-33.71-33.71-33.71-83.47t33.71-83.21q33.71-33.46 83.21-33.46 49.5 0 83.21 33.46 33.71 33.45 33.71 83.21 0 49.76-33.71 83.47T480-504.77ZM200-215.38v-60.52q0-25.89 14.91-46.98 14.91-21.09 39.45-32.86 58.41-26.49 114.44-39.99 56.04-13.5 111.18-13.5 55.15 0 111.12 13.58 55.98 13.57 114.11 40.14 25.09 11.64 39.94 32.68Q760-301.79 760-275.9v60.52H200Zm33.85-33.85h492.3v-26.67q0-14.59-9.7-27.89-9.71-13.31-26.65-22.21-52.47-25.56-104.35-37.47-51.89-11.91-105.45-11.91t-105.86 11.91Q321.85-351.56 270.05-326q-16.95 8.9-26.58 22.21-9.62 13.3-9.62 27.89v26.67ZM480-538.62q34.95 0 59.01-24.06 24.07-24.06 24.07-59.01t-24.07-59.02q-24.06-24.06-59.01-24.06t-59.01 24.06q-24.07 24.07-24.07 59.02t24.07 59.01q24.06 24.06 59.01 24.06Zm0-83.07Zm0 372.46Z"/></svg>' 
        + email;

        // Remove sign-in button if client is logged in
        let signIn = document.querySelector(".userSignUp");
        signIn.remove();

        // Add session-active class to the body
        let body = document.querySelector("body");
        body.classList.add("session-active");

        // Handle login/logout interaction
        let showLoginPopupCta = document.querySelector(".userSignIn");

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
        // Show login and sign-in popups if client is not logged in
        let showLoginPopupCta = document.querySelectorAll(".userSignIn, #loginPopupClose");
        showLoginPopupCta.forEach(function(loginPopupCta) {
            loginPopupCta.addEventListener('click', function (event) {
                event.preventDefault();

                let popupLogIn = document.querySelector("#logInPopup");
                let popupSignIn = document.querySelector("#signInPopup");
                popupSignIn.classList.remove("active");
                popupLogIn.classList.toggle("active");
            });
        });
        
        let showSignPopupCta = document.querySelectorAll(".userSignUp, #signInPopupClose");
        showSignPopupCta.forEach(function(SignPopupCta) {
            SignPopupCta.addEventListener('click', function (event) {
                event.preventDefault();
                
                let popupSignIn = document.querySelector("#signInPopup");
                let popupLogIn = document.querySelector("#logInPopup");
                popupLogIn.classList.remove("active");
                popupSignIn.classList.toggle("active");
            });
        });
    }
}

showClient();


// --------
// SIGN IN
// --------

// Create new user and check if created succesfully
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
        console.log('Succesfully created new user');
        
    } catch (error){
        console.error('Error creating new user:', error);

      // Example: Custom error message handling
        if (error.message.includes("Password too short")) {
            shortPassword(); // Call your function for handling short passwords
        } else if (error.message.includes("Password too simple")) {
            simplePassword(); // Call your function for handling simple passwords
        } else {
            console.error("An unexpected error occurred.");
        }

        if (error.response?.status === 429) {
            const retryAfter = error.response.headers['retry-after'] || 1; // Default retry time
            console.warn(`Rate limit hit. Retrying after ${retryAfter} seconds...`);
            await sleep(retryAfter * 1000); // Convert seconds to milliseconds
            return createNewUser(newEmail, newPass, newUser); // Retry the request
        }
    }
}

// Send sign-up form and push data into createNewUser()
let signIn = document.querySelector("#signInPopup");
signIn.addEventListener('submit', function (event) {
    event.preventDefault();

    let formData = new FormData(event.target);
    let data = Object.fromEntries(formData.entries());

    // Log the data for debugging
    console.log(data);

    // Safely retrieve values and validate
    let newUser = data['new-username'] ? data['new-username'].trim() : '';
    let newPass = data['new-password'] ? data['new-password'].trim() : '';
    let newEmail = data['new-email'] ? data['new-email'].trim() : '';

    if (!newUser || !newPass || !newEmail) {
        console.error('All fields are required');
        return;
    }

    createNewUser(newEmail, newPass, newUser);
});


// --------
// LOG IN
// --------

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

// Submiting login form
let logIn = document.querySelector("#logInPopup");
logIn.addEventListener('submit', function (event) {
    event.preventDefault();

    let formData = new FormData(event.target);
    let data = Object.fromEntries(formData.entries());
    let email = data['email'].trim();
    let password = data['password'].trim();
    loginFunction(email, password);
});

// Get user label to analyze which actions can user do
async function getUserLabel() {
    const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
        .setProject('673e5814003a6ffce52d'); // Your project ID

    const account = new Account(client);

    try {
        // Fetch user info
        const user = await account.get();
        console.log("User Labels:", user.prefs.labels || []); // Logs current labels
        console.log("User Preferences:", user.prefs);         // Logs current preferences

        // Ensure labels exist and check for "basic"
        const currentLabels = user.prefs.labels || [];
        if (!currentLabels.includes("basic")) {
            // Add "basic" label
            const updatedLabels = [...currentLabels, "basic"];
            
            // Update user preferences with new labels
            const result = await account.updatePrefs({ labels: updatedLabels });
            console.log("Labels updated successfully:", result.prefs.labels);
        } else {
            console.log("Label 'basic' is already present.");
        }
    } catch (error) {
        console.error("Error managing user labels:", error.message || error);
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