const registerForm =
    document.getElementById("registerForm");

registerForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const username =
            document.getElementById("username").value;

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        const response =
            await fetch(
                "http://localhost:5000/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                        "application/json"
                    },

                    body: JSON.stringify({
                        username,
                        email,
                        password
                    })
                }
            );

        const data =
            await response.json();

        if (response.ok) {

            document.getElementById("message").textContent =
                "Registration Successful! Redirecting to login...";

            setTimeout(() => {

                window.location.href = "login.html";

            }, 2000);

        }
        else {

            document.getElementById("message").textContent =
                data.message;

        }

    }
);