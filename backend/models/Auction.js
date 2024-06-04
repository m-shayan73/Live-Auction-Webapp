import mongoose from 'mongoose';

const auctionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required."]
    },
    description: {
        type: String,
        required: [true, "Description is required."]
    },
    startingPrice: {
        type: Number,
        required: [true, "Starting price is required."],
        min: [0, "Starting price cannot be less than zero."]
    },
    startingTime: {
        type: Date,
        required: [true, "Starting time is required."]
    },
    endingTime: {
        type: Date,
        required: [true, "Ending time is required."]
    },
    currentPrice: {
        type: Number,
        required: [true, "Current price is required."],
        min: [0, "Current price cannot be less than zero."]
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    highestBidder: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    status: {
        type: String,
    },
});

const Auction = mongoose.model('Auction', auctionSchema);
export default Auction;