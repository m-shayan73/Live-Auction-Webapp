import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required."],
    },
    username: {
        type: String,
        required: [true, "username is required."],
        unique: [true, "this username is already taken."]
    },
    password: {
        type: String,
        required: [true, "password is required."],
    },
    itemsOwned: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Auction' }],
    auctionsCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Auction' }],
});

const User = mongoose.model("User", userSchema);
export default User;