import { Server } from "socket.io";
import http from "http";
import { app } from "./app.js";
import { config } from "dotenv";
import mongoose from "mongoose";

import Auction from "./models/Auction.js";
import { checkAuctionEndTime } from "./controllers/Auction.js";

// Load environment variables
config({
  path: "./.env",
});

// Create HTTP server
const server = http.createServer(app);

// Set up Socket.IO
export const io = new Server(server, {
  cors: {
    origin: "*", // Replace "*" with your frontend URL for better security
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  },
});

io.on("connection", (socket) => {
  console.log("USER CONNECTED:", socket.id);

  socket.on('joinAuction', (auctionId) => {
    socket.join(auctionId);
  });

  socket.on('placeBid', async ({ auctionId, bidAmount, username, userId }) => {
    await updateAuctionBid(auctionId, bidAmount, userId);
    io.to(auctionId).emit('updateAuction', { highestBidder: username });
  });

  socket.on('leaveAuction', (auctionId) => {
    socket.leave(auctionId);
  });
});

// Function to update auction bids
async function updateAuctionBid(auctionId, bidAmount, userId) {
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
    } else {
      console.log('Bid is not higher than the current price');
    }
  } catch (error) {
    console.error('Error fetching or updating auction:', error);
  }
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONG_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to Database");

    const setupAuctionEndTimes = async () => {
      try {
        const auctions = await Auction.find({ status: { $ne: 'completed' } });
        console.log(auctions);
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
    console.error('Database connection error:', error);
    process.exit(1);
  });

// Start the server only once
const PORT = process.env.PORT || 8000;
if (!server.listening) {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export the server for Vercel
export default server;