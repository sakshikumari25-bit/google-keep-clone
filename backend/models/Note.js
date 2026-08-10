const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: ""
    },

    description: {
      type: String,
      default: ""
    },

    color: {
      type: String,
      default: "#ffffff"
    },

    pinned: {
      type: Boolean,
      default: false
    },

    archived: {
      type: Boolean,
      default: false
    },

    trashed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;