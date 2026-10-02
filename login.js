
const loginForm = document.getElementById("login-form");
const registerBtn = document.getElementById("register-btn");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            message.textContent = "Login successful!";
            window.location.href = "index.html";
        } else {
            message.textContent = data.message || "Login failed";
        }
    } catch (error) {
        message.textContent = "Cannot connect to server";
    }
});

registerBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        message.textContent = "Enter email and password first";
        return;
    }

    try {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        message.textContent = data.message || "Registration completed";
    } catch (error) {
        message.textContent = "Cannot connect to server";
    }
});