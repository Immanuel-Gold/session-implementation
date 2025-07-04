import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import { verifyUser } from "./middleware/verify.js";

dotenv.config();
const app = express();

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Users
let users = [
  {
    username: "John Doe",
    email: "johndoe@gmail.com",
    password: "john-doe0001",
  },
];

// Register User
app.post(`/api/register`, (req, res) => {
  const { username, email, password } = req.body;
  // Check if body field is filled
  if (!username || !email || !password) {
    return res
      .status(401)
      .json({ err: "Fill in the Username, Email, and Password Field!" });
  }

  const user = users.find((user) => user.email === email);

  //Check if user already exists
  if (user) {
    return res.status(401).json({ err: "User Already Exists!" });
  }
  // Push new user to Users Array
  users.push({ username, email, password });



  return res.status(201).json({ username, email, password });
});

// Login User
app.post(`/api/login`, (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(401)
      .json({ err: "Fill in the Username, Email, and Password Field!" });
  }

  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(401).json({ err: "User Not Found!" });
  }

  req.session.user = { username, email, password };


  return res.status(200).json(user);
});

app.get(`/api/me`, verifyUser, (req, res) => {
  return res.status(200).json(req.session.user);
});

app.get(`/api/logout`, (req, res) => {
  req.session.destroy();
  res.clearCookie("connect.sid");

  return res.sendStatus(200);
});

app.listen(4000, () => console.log("Server Running on  PORT: 4000"));
