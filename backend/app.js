import express from "express";
import cors from "cors";

export const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initial Check
app.get('/', (req, res) => {
    res.send('Hello');
  });