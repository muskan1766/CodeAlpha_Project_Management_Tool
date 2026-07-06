const createProjectBtn =
    document.getElementById("createProjectBtn");

createProjectBtn.addEventListener(
    "click",
    async () => {

        const projectName =
            document.getElementById("projectName").value;

        const members =
        document.getElementById("projectMembers").value;

        const membersArray =
            members
                .split(",")
                .map(member => member.trim())
                .filter(member => member !== "");

        if (!projectName.trim()) {
            alert("Enter project name");
            return;
        }

        const currentUser =
            JSON.parse(
                localStorage.getItem("currentUser")
            );

        const response =
            await fetch(
                "http://localhost:5000/projects",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        name: projectName,

                        ownerId: currentUser._id,

                        ownerName: currentUser.username,

                        members: membersArray

                    })

                }
            );

        const project =
            await response.json();

        document.getElementById("projectMessage").textContent = "Project Created Successfully!";

        document.getElementById(
            "projectName"
        ).value = "";

        document.getElementById("projectMembers").value = "";

        loadProjects();

    }
);

async function loadProjects() {

    const currentUser =
        JSON.parse(
            localStorage.getItem("currentUser")
        );

    const response =
        await fetch(

            `http://localhost:5000/projects?ownerId=${currentUser._id}&username=${currentUser.username}`

        );

    const projects =
        await response.json();

    const projectsList =
        document.getElementById("projectsList");

    projectsList.innerHTML = "";

    projects.forEach(project => {

        projectsList.innerHTML += `
            <div class="projectCard">

                <h3>📁 ${project.name}</h3>

                <p class="projectOwner">
                    👤 Owner: ${project.ownerName}
                </p>

                <p class="projectMembers">
                    👥 Members:
                    ${project.members.length > 0
                        ? project.members.join(", ")
                        : "None"}
                </p>

                <div class="projectButtons">

                    <button
                        onclick="openProject('${project._id}')"
                        class="openBtn"
                    >
                        📂 Open
                    </button>

                    <button
                        onclick="deleteProject('${project._id}')"
                        class="deleteBtn"
                    >
                        🗑 Delete
                    </button>

                </div>

            </div>
        `;
    });

}
loadProjects();

function openProject(projectId){

    localStorage.setItem(
        "currentProject",
        projectId
    );

    window.location.href =
        "project.html";
}

async function deleteProject(projectId) {

    const confirmDelete =
        confirm("Delete this project and all its tasks?");

    if (!confirmDelete) return;

    await fetch(
        `http://localhost:5000/projects/${projectId}`,
        {
            method: "DELETE"
        }
    );

    loadProjects();

}

const logoutBtn =
    document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("currentUser");

    window.location.href = "login.html";

});