import { themeColors } from './colors';

// Initialize variables
let html = document.querySelector("html");
let root = document.documentElement;
let light = "theme-light";
let dark = "theme-dark";
let theme = localStorage.getItem("Theme") ? JSON.parse(localStorage.getItem("Theme")) : [];

// Check if theme is empty or doesn't exist, and set it to light theme by default
if (theme.length === 0) {
    theme.push(light);  // Add the "theme-light" to the array
    localStorage.setItem("Theme", JSON.stringify(theme));  // Save the updated theme in localStorage
    html.classList.add(light);  // Apply the light theme to the HTML element
    applyThemeColors('light');  // Apply light theme styling
} else {
    // Apply themes from localStorage if already set
    theme.forEach(t => {
        html.classList.add(t);  // Add the theme class to the HTML element
        if (t === light) applyThemeColors('light');
        if (t === dark) applyThemeColors('dark');
    });
}

// Toggle theme when user clicks the button
let ctaThemeChange = document.querySelector("#themeChange");
ctaThemeChange.addEventListener('click', function (event) {
    event.preventDefault();
    changeTheme();
});

// Apply the appropriate theme colors
function applyThemeColors(theme) {
    const colors = themeColors[theme];

    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-opacity', colors.primary);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-text-opacity', colors.textOpacity);
    root.style.setProperty('--color-border-basic', colors.borderBasic);
    root.style.setProperty('--color-border-focus', colors.borderFocus);
    root.style.setProperty('--color-primary-transparent', colors.primaryTransparent);
    root.style.setProperty('--color-popup-bg', colors.popupBg);
}


// Handle theme change
let themeChange = document.querySelector("#themeChange");
function changeTheme() {
    if (theme.includes(light)) {
        // Switch to dark theme
        theme = theme.filter(item => item !== light);
        theme.push(dark);
        localStorage.setItem("Theme", JSON.stringify(theme));  // Save the updated theme in localStorage

        html.classList.remove(light);
        html.classList.add(dark);
        applyThemeColors('dark');  // Apply dark theme colors

        themeChange.setAttribute("data-title", "Light theme")
        
    } else {
        // Switch to light theme
        theme = theme.filter(item => item !== dark);
        theme.push(light);
        localStorage.setItem("Theme", JSON.stringify(theme));  // Save the updated theme in localStorage
        
        html.classList.remove(dark);
        html.classList.add(light);
        applyThemeColors('light');  // Apply light theme colors
        
        themeChange.setAttribute("data-title", "Dark theme")
    }
}
