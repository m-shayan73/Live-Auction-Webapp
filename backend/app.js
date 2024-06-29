import express from "express";
import cors from "cors";

export const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
