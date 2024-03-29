// Import required packages
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; // Import middleware cors

// Create an Express app
const app = express();

// Load environment variables from .env file
dotenv.config();

// Set the port from environment variables or default to 7000
const PORT = process.env.PORT || 8000;

// Get the MongoDB connection URL from environment variables
const MONGOURL = process.env.MONGO_URL;

app.use(cors()); // Gunakan middleware cors

// Connect to MongoDB and start the server
mongoose.connect(MONGOURL).then(() => {
  console.log("Database connected successfully.");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

// Define the schema for the user data using Mongoose
const userSchema = new mongoose.Schema({
  nama_kelas: String,
});

// http://localhost:8000/getUser
// http://localhost:8000/addUser/nama_kelas/kelas%2015
// http://localhost:8000/updateUser/id/65fb79191334b6c176cf3613/nama_kelas/kelas%2000
// http://localhost:8000/deleteUser/65fb79191334b6c176cf3613


const UserModel = mongoose.model("User", userSchema, "siswa");
// Set up a route in the Express application to handle GET requests to "/getUsers"
app.get("/getUser", async (req, res) => {
  try {
    // const userData = await UserModel.find();
    const userData = await UserModel.find().exec();
    // Set the Content-Type header to application/json
    res.setHeader("Content-Type", "application/json");
    res.json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to handle direct typing in browser
app.get("/addUser/nama_kelas/:nama_kelas", async (req, res) => {
  try {
    const { nama_kelas } = req.params;
    const newUser = new UserModel({ nama_kelas });
    await newUser.save();
    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to handle updating user with _id and nama_kelas as path parameters
app.get("/updateUser/id/:id/nama_kelas/:nama_kelas", async (req, res) => {
  try {
    const { id, nama_kelas } = req.params;
    const updatedUser = await UserModel.findByIdAndUpdate(id, { nama_kelas }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to delete an existing user by _id
app.get("/deleteUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await UserModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});








