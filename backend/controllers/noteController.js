const Note = require("../models/Note");

// GET ALL NOTES
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({
      createdAt: -1
    });

    res.json({
      success: true,
      data: notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// CREATE NOTE
const createNote = async (req, res) => {
  try {
    const title = req.body.title || "";
    const description = req.body.description || "";
    const color = req.body.color || "#ffffff";

    if (!title.trim() && !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter title or description"
      });
    }

    const note = await Note.create({
      title: title,
      description: description,
      color: color,
      pinned: false,
      archived: false,
      trashed: false
    });

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// UPDATE NOTE
const updateNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true
      }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    res.json({
      success: true,
      message: "Note updated successfully",
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// MOVE NOTE TO TRASH
const moveToTrash = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      {
        trashed: true,
        archived: false,
        pinned: false
      },
      {
        new: true
      }
    );

    res.json({
      success: true,
      message: "Note moved to trash",
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// RESTORE NOTE
const restoreNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      {
        trashed: false,
        archived: false
      },
      {
        new: true
      }
    );

    res.json({
      success: true,
      message: "Note restored",
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// PERMANENT DELETE
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    res.json({
      success: true,
      message: "Note permanently deleted"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ARCHIVE NOTE
const archiveNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      {
        archived: true,
        trashed: false
      },
      {
        new: true
      }
    );

    res.json({
      success: true,
      message: "Note archived",
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// UNARCHIVE NOTE
const unarchiveNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      {
        archived: false
      },
      {
        new: true
      }
    );

    res.json({
      success: true,
      message: "Note removed from archive",
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// MOVE ALL NOTES TO TRASH
const trashAllNotes = async (req, res) => {
  try {
    await Note.updateMany(
      {
        trashed: false
      },
      {
        trashed: true,
        archived: false,
        pinned: false
      }
    );

    res.json({
      success: true,
      message: "All notes moved to trash"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// EMPTY TRASH
const emptyTrash = async (req, res) => {
  try {
    await Note.deleteMany({
      trashed: true
    });

    res.json({
      success: true,
      message: "Trash emptied"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  getNotes,
  createNote,
  updateNote,
  moveToTrash,
  restoreNote,
  deleteNote,
  archiveNote,
  unarchiveNote,
  trashAllNotes,
  emptyTrash
};