window.onload = function() {
    document.getElementById("login-form").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the default form submission

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const errorMessage = document.getElementById("error-message");

        // Sample login validation (you can replace this with a backend request)
        if (username === "admin" && password === "password123") {
            window.location.href = "dashboard.html"; // Redirect to dashboard (or another page)
        } else {
            errorMessage.textContent = "Invalid username or password.";
        }
    });
};
