const express = require("express");

const {
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
} = require("../controllers/noteController");

const router = express.Router();



router.get("/", getNotes);


router.post("/", createNote);



router.put("/trash-all", trashAllNotes);

router.delete("/trash-all", emptyTrash);



router.put("/:id", updateNote);



router.put("/:id/trash", moveToTrash);



router.put("/:id/restore", restoreNote);


router.put("/:id/archive", archiveNote);



router.put("/:id/unarchive", unarchiveNote);



router.delete("/:id", deleteNote);


module.exports = router;