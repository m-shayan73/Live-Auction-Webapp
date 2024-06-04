import express from "express";
import { CreateAuction, GetAuctions, GetAllAuctions, SearchAuctions } from "../controllers/Auction.js";
const app = express.Router();

app.post("/createauction", CreateAuction);
app.post("/getauctions", GetAuctions);
app.get("/getallauctions", GetAllAuctions);
app.get("/search", SearchAuctions);

export default app;