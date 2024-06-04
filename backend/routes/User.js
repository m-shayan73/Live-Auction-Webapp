import express from "express";
import { Signup, Login, GetUserDetails, ChangePassword } from "../controllers/User.js";
const app = express.Router();

app.post("/signup", Signup);
app.post("/login", Login);
app.get("/getuser/:userId", GetUserDetails);
app.put("/changepassword", ChangePassword);

export default app;