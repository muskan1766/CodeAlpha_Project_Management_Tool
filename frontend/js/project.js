const projectId =
    localStorage.getItem("currentProject");

document.getElementById("projectTitle").textContent =
    "Project Tasks";

const addTaskBtn =
    document.getElementById("addTaskBtn");

addTaskBtn.addEventListener(
    "click",
    async () => {

        const taskName =
            document.getElementById("taskName").value;

        const assignedTo =
            document.getElementById("assignedTo").value;

        if (!taskName.trim()) {

            alert("Enter task name");

            return;
        }

        await fetch(
            "http://localhost:5000/tasks",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({

                    name: taskName,

                    assignedTo: assignedTo,

                    projectId: projectId

                })
            }
        );

        document.getElementById(
            "taskMessage"
        ).textContent =
        "Task Added Successfully!";

        document.getElementById(
            "taskName"
        ).value = "";

        document.getElementById("assignedTo").value = "";

        loadTasks();

    }
);

async function loadTasks() {

    const response =
        await fetch(
            `http://localhost:5000/tasks/${projectId}`
        );

    const tasks =
        await response.json();

    const tasksList =
        document.getElementById("tasksList");

    tasksList.innerHTML = "";

    tasks.forEach((task, index) => {

        tasksList.innerHTML += `
        <div class="taskItem">

            <div class="taskHeader">

                <span class="taskNumber">
                    📌 Task ${index + 1}
                </span>

                <button
                    class="deleteBtn"
                    onclick="deleteTask('${task._id}')">
                    Delete
                </button>

            </div>

            <div class="taskTitle">
                ${task.title.charAt(0).toUpperCase() + task.title.slice(1)}
            </div>

            <div class="assignedUser">
                👤 Assigned To: ${task.assignedTo}
            </div>

            <div class="comments">

                <strong>Comments</strong>

                ${task.comments.map(comment =>
                    `<p>💬 ${comment}</p>`
                ).join("")}

                <input
                    type="text"
                    id="comment-${task._id}"
                    placeholder="Write a comment..."
                >

                <button
                    class="commentBtn"
                    onclick="addComment('${task._id}')">
                    Add Comment
                </button>

            </div>

        </div>
        `;

    });

}

async function deleteTask(taskId) {

    const confirmDelete =
        confirm("Delete this task?");

    if (!confirmDelete) return;

    await fetch(
        `http://localhost:5000/tasks/${taskId}`,
        {
            method: "DELETE"
        }
    );

    loadTasks();

}

async function addComment(taskId) {

    const comment = document.getElementById(
        `comment-${taskId}`
    ).value;

    if (!comment.trim()) {

        alert("Enter a comment");

        return;

    }

    await fetch(

        `http://localhost:5000/tasks/comment/${taskId}`,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                comment: comment

            })

        }

    );

    loadTasks();

}

loadTasks();