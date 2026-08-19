const API_URL = "https://google-keep-clone-111j.onrender.com/api/notes";

let notes = [];

let currentPage = "home";

let selectedColor = "#ffffff";

let editingNoteId = null;



// HTML elements

const titleInput = document.getElementById("titleInput");

const descriptionInput =
  document.getElementById("descriptionInput");

const addNoteButton =
  document.getElementById("addNoteButton");

const notesContainer =
  document.getElementById("notesContainer");

const searchInput =
  document.getElementById("searchInput");

const clearButton =
  document.getElementById("clearButton");

const pageTitle =
  document.getElementById("pageTitle");

const noteCount =
  document.getElementById("noteCount");

const menuButton =
  document.getElementById("menuButton");



// Get notes from backend

async function getNotes() {

  try {

    const response = await fetch(API_URL);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    notes = result.data;

    showNotes();

  } catch (error) {

    console.log(error);

    notesContainer.innerHTML = `
      <div class="empty-message">
        Backend connect nahi hai.
        <br><br>
        Terminal me
        <b>npm run dev</b>
        chalao.
      </div>
    `;
  }
}



// Add new note

async function addNote() {

  const title = titleInput.value.trim();

  const description =
    descriptionInput.value.trim();


  if (!title && !description) {

    alert("Title ya description likho.");

    return;
  }


  try {

    const response = await fetch(API_URL, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        title: title,
        description: description,
        color: selectedColor
      })

    });


    const result = await response.json();


    if (!response.ok) {

      alert(result.message);

      return;
    }


    clearForm();

    getNotes();


  } catch (error) {

    console.log(error);

    alert("Note save nahi hua.");
  }
}



// Update note

async function updateNote(id, data) {

  try {

    const response = await fetch(
      `${API_URL}/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(data)
      }
    );


    const result = await response.json();


    if (!response.ok) {

      alert(result.message);

      return;
    }


    clearForm();

    getNotes();


  } catch (error) {

    console.log(error);

    alert("Note update nahi hua.");
  }
}



// Delete note

async function moveToTrash(id) {

  try {

    await fetch(
      `${API_URL}/${id}/trash`,
      {
        method: "PUT"
      }
    );


    getNotes();


  } catch (error) {

    console.log(error);

    alert("Note trash me nahi gaya.");
  }
}



// Restore note

async function restoreNote(id) {

  try {

    await fetch(
      `${API_URL}/${id}/restore`,
      {
        method: "PUT"
      }
    );


    getNotes();


  } catch (error) {

    console.log(error);

    alert("Note restore nahi hua.");
  }
}



// Delete forever

async function deleteForever(id) {

  const answer =
    confirm("Note permanently delete karna hai?");


  if (!answer) {
    return;
  }


  try {

    await fetch(
      `${API_URL}/${id}`,
      {
        method: "DELETE"
      }
    );


    getNotes();


  } catch (error) {

    console.log(error);

    alert("Note delete nahi hua.");
  }
}



// Archive

async function archiveNote(id) {

  try {

    await fetch(
      `${API_URL}/${id}/archive`,
      {
        method: "PUT"
      }
    );


    getNotes();


  } catch (error) {

    console.log(error);

    alert("Archive nahi hua.");
  }
}



// Remove from archive

async function unarchiveNote(id) {

  try {

    await fetch(
      `${API_URL}/${id}/unarchive`,
      {
        method: "PUT"
      }
    );


    getNotes();


  } catch (error) {

    console.log(error);

    alert("Unarchive nahi hua.");
  }
}



// Pin / Unpin

async function changePin(id, currentPin) {

  await updateNote(id, {
    pinned: !currentPin
  });
}



// Copy note

function copyNote(note) {

  const text =
    note.title + "\n" + note.description;


  navigator.clipboard
    .writeText(text)
    .then(() => {

      alert("Note copied.");

    })
    .catch(() => {

      alert("Copy nahi hua.");

    });
}



// Edit note

function editNote(note) {

  editingNoteId = note._id;


  titleInput.value = note.title;

  descriptionInput.value =
    note.description;


  selectedColor =
    note.color || "#ffffff";


  addNoteButton.textContent =
    "Update Note";


  document
    .querySelectorAll(".color-button")
    .forEach((button) => {

      button.classList.remove("selected");


      if (
        button.dataset.color === selectedColor
      ) {

        button.classList.add("selected");

      }

    });


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}



// Clear input box

function clearForm() {

  titleInput.value = "";

  descriptionInput.value = "";

  selectedColor = "#ffffff";

  editingNoteId = null;

  addNoteButton.textContent =
    "+ Add Note";


  document
    .querySelectorAll(".color-button")
    .forEach((button) => {

      button.classList.remove("selected");

    });
}



// Show notes

function showNotes() {

  let visibleNotes = [];


  // HOME

  if (currentPage === "home") {

    visibleNotes =
      notes.filter((note) => {

        return (
          note.trashed === false &&
          note.archived === false
        );

      });


    pageTitle.textContent =
      "My Notes";


    clearButton.textContent =
      "Clear All";
  }


  // ARCHIVE

  if (currentPage === "archive") {

    visibleNotes =
      notes.filter((note) => {

        return (
          note.trashed === false &&
          note.archived === true
        );

      });


    pageTitle.textContent =
      "Archive";


    clearButton.textContent =
      "Clear All";
  }


  // TRASH

  if (currentPage === "trash") {

    visibleNotes =
      notes.filter((note) => {

        return note.trashed === true;

      });


    pageTitle.textContent =
      "Trash";


    clearButton.textContent =
      "Empty Trash";
  }



  // SEARCH

  const searchText =
    searchInput.value
      .toLowerCase()
      .trim();


  if (searchText) {

    visibleNotes =
      visibleNotes.filter((note) => {

        const title =
          note.title.toLowerCase();

        const description =
          note.description.toLowerCase();


        return (
          title.includes(searchText) ||
          description.includes(searchText)
        );

      });
  }



  // Pin notes first

  visibleNotes.sort((a, b) => {

    if (a.pinned && !b.pinned) {
      return -1;
    }

    if (!a.pinned && b.pinned) {
      return 1;
    }

    return 0;
  });



  noteCount.textContent =
    visibleNotes.length + " notes";



  // No notes

  if (visibleNotes.length === 0) {

    notesContainer.innerHTML = `
      <div class="empty-message">
        No notes found.
      </div>
    `;

    return;
  }



  // Show notes

  notesContainer.innerHTML = "";


  visibleNotes.forEach((note) => {

    const card =
      document.createElement("div");


    card.className =
      "note-card";


    card.style.background =
      note.color || "#ffffff";



    // Title

    const top =
      document.createElement("div");


    top.className =
      "note-top";


    const title =
      document.createElement("h3");


    title.textContent =
      note.title;


    top.appendChild(title);



    // Pin button

    if (currentPage !== "trash") {

      const pinButton =
        document.createElement("button");


      pinButton.className =
        "pin-button";


      if (note.pinned) {
        pinButton.textContent = "📌";
      } else {
        pinButton.textContent = "📍";
      }


      pinButton.onclick = function () {

        changePin(
          note._id,
          note.pinned
        );

      };


      top.appendChild(pinButton);
    }


    card.appendChild(top);



    // Description

    const description =
      document.createElement("p");


    description.textContent =
      note.description;


    card.appendChild(description);



    // Buttons

    const actions =
      document.createElement("div");


    actions.className =
      "note-actions";



    // Trash page buttons

    if (currentPage === "trash") {

      const restoreButton =
        document.createElement("button");


      restoreButton.textContent =
        "♻️ Restore";


      restoreButton.onclick =
        function () {

          restoreNote(note._id);

        };


      actions.appendChild(
        restoreButton
      );



      const deleteButton =
        document.createElement("button");


      deleteButton.textContent =
        "🗑️ Delete Forever";


      deleteButton.onclick =
        function () {

          deleteForever(note._id);

        };


      actions.appendChild(
        deleteButton
      );

    }


    // Home and Archive buttons

    else {

      const editButton =
        document.createElement("button");


      editButton.textContent =
        "✏️ Edit";


      editButton.onclick =
        function () {

          editNote(note);

        };


      actions.appendChild(
        editButton
      );



      const copyButton =
        document.createElement("button");


      copyButton.textContent =
        "📋 Copy";


      copyButton.onclick =
        function () {

          copyNote(note);

        };


      actions.appendChild(
        copyButton
      );



      const archiveButton =
        document.createElement("button");


      if (currentPage === "archive") {

        archiveButton.textContent =
          "📦 Unarchive";


        archiveButton.onclick =
          function () {

            unarchiveNote(note._id);

          };

      } else {

        archiveButton.textContent =
          "📦 Archive";


        archiveButton.onclick =
          function () {

            archiveNote(note._id);

          };
      }


      actions.appendChild(
        archiveButton
      );



      const trashButton =
        document.createElement("button");


      trashButton.textContent =
        "🗑️ Delete";


      trashButton.onclick =
        function () {

          moveToTrash(note._id);

        };


      actions.appendChild(
        trashButton
      );

    }


    card.appendChild(actions);


    notesContainer.appendChild(card);

  });

}



// Clear all notes

async function clearAllNotes() {

  const answer =
    confirm(
      "Saare notes Trash me bhejna hai?"
    );


  if (!answer) {
    return;
  }


  try {

    await fetch(
      `${API_URL}/trash-all`,
      {
        method: "PUT"
      }
    );


    getNotes();


  } catch (error) {

    console.log(error);

    alert("Clear All nahi hua.");
  }
}



// Empty trash

async function emptyTrash() {

  const answer =
    confirm(
      "Trash ke saare notes permanently delete ho jayenge. Continue?"
    );


  if (!answer) {
    return;
  }


  try {

    await fetch(
      `${API_URL}/trash-all`,
      {
        method: "DELETE"
      }
    );


    getNotes();


  } catch (error) {

    console.log(error);

    alert("Trash empty nahi hua.");
  }
}



// Add button

addNoteButton.addEventListener(
  "click",
  function () {

    if (editingNoteId) {

      updateNote(
        editingNoteId,
        {
          title: titleInput.value.trim(),

          description:
            descriptionInput.value.trim(),

          color: selectedColor
        }
      );

    } else {

      addNote();

    }

  }
);



// Search

searchInput.addEventListener(
  "input",
  function () {

    showNotes();

  }
);



// Clear button

clearButton.addEventListener(
  "click",
  function () {

    if (currentPage === "trash") {

      emptyTrash();

    } else {

      clearAllNotes();

    }

  }
);



// Sidebar buttons

document
  .querySelectorAll(".navigation-button")
  .forEach((button) => {

    button.addEventListener(
      "click",
      function () {

        document
          .querySelectorAll(".navigation-button")
          .forEach((item) => {

            item.classList.remove(
              "active"
            );

          });


        button.classList.add("active");


        currentPage =
          button.dataset.page;


        showNotes();

      }
    );

  });



// Color buttons

document
  .querySelectorAll(".color-button")
  .forEach((button) => {

    button.addEventListener(
      "click",
      function () {

        document
          .querySelectorAll(".color-button")
          .forEach((item) => {

            item.classList.remove(
              "selected"
            );

          });


        button.classList.add(
          "selected"
        );


        selectedColor =
          button.dataset.color;

      }
    );

  });





menuButton.addEventListener(
  "click",
  function () {

    alert(
      "Home, Archive aur Trash left side me hain."
    );

  }
);





getNotes();