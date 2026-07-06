const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({

    name: String,

    ownerId: String,

    ownerName: String,

    members: {

        type: [String],

        default: []

    }

});

module.exports =
    mongoose.model(
        "Project",
        projectSchema
    );