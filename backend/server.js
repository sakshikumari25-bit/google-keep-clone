require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const noteRoutes = require("./routes/noteRoutes");

const app = express();


// Allow frontend to connect with backend
app.use(cors());


// Allow backend to receive JSON data
app.use(express.json());


// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Google Keep Backend is working"
  });
});


// Notes routes
app.use("/api/notes", noteRoutes);


const PORT = process.env.PORT || 5000;


// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:");
    console.log(error.message);
  });