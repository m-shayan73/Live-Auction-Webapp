import express from "express";
import cors from "cors";

export const app = express();

// CORS configuration
app.use(cors({
    origin: "*", // Change "*" to your frontend URL for better security
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204 // Some legacy browsers choke on 204
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle preflight requests
app.options('*', cors());

// Initial Check
app.get('/', (req, res) => {
  res.send('Hello');
});



// import express from "express";
// import cors from "cors";

// const app = express();

// app.use(cors({
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"]
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// export default app;