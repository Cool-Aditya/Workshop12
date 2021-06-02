const express = require("express");
const mongoose = require("mongoose");
const userSchema = require("./models/userSchema");
const User = require("./models/userSchema");

const app = express();

mongoose.connect("mongodb://localhost/users", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", async () => {
  console.log("Connected to database");
  // if ((await User.countDocuments().exec()) > 0) return;

  // Promise.all([
  //   User.create({ name: "User 1", age: "21", email: "a@123.com" }),
  //   User.create({ name: "User 2", age: "22", email: "a@123.com" }),
  //   User.create({ name: "User 3", age: "23", email: "a@123.com" }),
  //   User.create({ name: "User 4", age: "24", email: "a@123.com" }),
  //   User.create({ name: "User 5", age: "25", email: "a@123.com" }),
  //   User.create({ name: "User 6", age: "26", email: "a@123.com" }),
  // ]).then(() => console.log("Added users"));
});

app.use(express.json());

const userRouter = require("./routes/user");
app.use("/users", userRouter);

app.listen(3000, () => console.log("Server Started"));
