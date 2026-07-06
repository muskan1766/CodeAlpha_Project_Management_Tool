const loginForm =
    document.getElementById("loginForm");

loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const username =
            document.getElementById("loginUsername").value;

        const password =
            document.getElementById("loginPassword").value;

        const response =
            await fetch(
                "http://localhost:5000/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                }
            );

        const data =
            await response.json();

        if(response.ok){

            localStorage.setItem(
                "currentUser",
                JSON.stringify(data)
            );

            window.location.href =
                "dashboard.html";

        } else {

            alert(data.message);

        }

    }
);