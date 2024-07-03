import { Socket, Server } from "socket.io";
import http from "http";
import app from "./app.js";
import { config } from "dotenv";
import mongoose from "mongoose";

import userRoute from "./routes/User.js";
import auctionRoute from "./routes/Auction.js";

import Auction from "./models/Auction.js";

import { checkAuctionEndTime } from "./controllers/Auction.js";

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  },
});

config({
  path: "./config.env",
});


io.on("connection", (socket) => {
  console.log("USER CONNECTED:", socket.id);

  socket.on('joinAuction', (auctionId) => {
    socket.join(auctionId);
  });

  socket.on('placeBid', ({ auctionId, bidAmount, username, userId }) => {
    updateAuctionBid(auctionId, bidAmount, userId);
    io.to(auctionId).emit('updateAuction', { highestBidder: username });
  });

  socket.on('leaveAuction', (auctionId) => {
    socket.leave(auctionId);
  });
});

if (!server.listening) {
  server.listen(8000, () => {
    console.log("Server is running on port 8000");
  });
}


try {
  mongoose
    .connect(process.env.MONG_URI)
    .then(() => {
      console.log("Connected to Database");

      const setupAuctionEndTimes = async () => {
        try {
          const auctions = await Auction.find({ status: { $ne: 'completed' } });
          console.log(auctions)
          auctions.forEach(auction => {
            console.log(`Checking: ${auction}`);
            checkAuctionEndTime(auction);
          });
        } catch (error) {
          console.error('Failed to set up auction end times:', error);
        }
      };

      setupAuctionEndTimes();
    })
    .catch((error) => {
      console.log(error);
    });
} catch (err) {
  console.log(err);
}


app.use("/api/user", userRoute);
app.use("/api/auction", auctionRoute);

async function updateAuctionBid(auctionId, bidAmount, userId, socket) {
  try {
    const currentAuction = await Auction.findById(auctionId);

    if (!currentAuction) {
      console.error('Auction not found');
      return;
    }

    if (bidAmount > currentAuction.currentPrice) {
      currentAuction.currentPrice = bidAmount;
      currentAuction.highestBidder = userId;

      const updatedAuction = await currentAuction.save();
      console.log('Auction updated successfully:', updatedAuction);
      // io.to(auctionId).emit('updateAuction', updatedAuction.username);
    } else {
      console.log('Bid is not higher than the current price');
    }
  } catch (error) {
    console.error('Error fetching or updating auction:', error);
  }
}

// Initial Check
app.get('/', (req, res) => {
  res.send('Hello');
});

export default server;