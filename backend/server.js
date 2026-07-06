const bcrypt = require("bcrypt");
const Task = require("./models/Task");
const Project = require("./models/Project");
const User = require("./models/User");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    dbName: "project_management"
})
.then(() => {

    console.log(
        "MongoDB Connected"
    );

})
.catch(error => {

    console.log(error);

});

app.get("/", (req, res) => {

    res.send(
        "Project Management API Running"
    );

});


app.post("/register", async (req, res) => {

    try {

        const existingUser = await User.findOne({
            username: req.body.username
        });

        if (existingUser) {

            return res.status(400).json({
                message: "Username already exists"
            });

        }

        const hashedPassword =
            await bcrypt.hash(req.body.password, 10);

        const user = new User({

            username: req.body.username,

            email: req.body.email,

            password: hashedPassword

        });

        await user.save();

        res.json(user);

    }

    catch (error) {

        res.status(500).json(error);

    }

});

app.post("/login", async (req, res) => {

    try {

        const user = await User.findOne({
            username: req.body.username
        });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const isMatch =
            await bcrypt.compare(
                req.body.password,
                user.password
            );

        if (!isMatch) {

            return res.status(400).json({
                message: "Invalid password"
            });

        }

        res.json(user);

    } catch (error) {

        res.status(500).json(error);

    }

});

app.post("/projects", async (req, res) => {

    try {

        console.log(req.body);

        const project = new Project({

            name: req.body.name,

            ownerId: req.body.ownerId,

            ownerName: req.body.ownerName,

            members: req.body.members || []

        });

        await project.save();

        console.log(project);

        res.json(project);

    } catch (error) {

        console.log(error);
        res.status(500).json(error);

    }

});

app.get("/projects", async (req, res) => {

    try {

        const ownerId = req.query.ownerId;
        const username = req.query.username;

        const projects = await Project.find({

            $or: [

                { ownerId: ownerId },

                { members: username }

            ]

        });

        res.json(projects);

    }

    catch (error) {

        res.status(500).json(error);

    }

});

app.post("/tasks", async (req,res)=>{

    const task = new Task({

        title: req.body.name,

        assignedTo: req.body.assignedTo,

        projectId: req.body.projectId

    });

    await task.save();

    res.json(task);

});

app.get("/tasks/:projectId",

    async (req,res)=>{

        const tasks =
            await Task.find({

                projectId:
                req.params.projectId

            });

        res.json(tasks);

});

app.delete("/tasks/:id", async (req, res) => {

    await Task.findByIdAndDelete(req.params.id);

    res.json({
        message: "Task Deleted"
    });

});

app.delete("/projects/:id", async (req, res) => {

    await Project.findByIdAndDelete(req.params.id);

    await Task.deleteMany({
        projectId: req.params.id
    });

    res.json({
        message: "Project Deleted"
    });

});

app.post("/tasks/comment/:taskId", async (req, res) => {

    try {

        const task = await Task.findById(req.params.taskId);

        task.comments.push(req.body.comment);

        await task.save();

        res.json(task);

    }

    catch (error) {

        res.status(500).json(error);

    }

});

app.listen(5000, () => {

    console.log(
        "Server running on port 5000"
    );

});