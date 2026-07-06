const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({

    title: String,

    assignedTo: String,

    description: String,

    status: {
        type: String,
        default: "To Do"
    },

    projectId: String,

    comments: {
        type: [String],
        default: []
    }

});

module.exports =
    mongoose.model(
        "Task",
        taskSchema
    );