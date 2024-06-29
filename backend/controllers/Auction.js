import Auction from "../models/Auction.js";
import User from "../models/User.js";
import { io } from "../server.js";

export function checkAuctionEndTime(auction) {
    const auctionId = auction._id;
    const startTimeDate = new Date(auction.startingTime);
    const endTimeDate = new Date(auction.endingTime);
    const timeToStart = startTimeDate - Date.now();

    console.log(auctionId, auction.startingTime, auction.endingTime, timeToStart);

    if (auction.status === 'toStart') {
        if (timeToStart > 0) {
            setTimeout(() => {
                Auction.updateOne({ _id: auctionId }, { status: 'ongoing' }).then(() => {
                    console.log(`${auctionId} started`);
                }).catch(error => {
                    console.error(`Failed to update auction ${auctionId}:`, error);
                });
            }, timeToStart);
        }
        else {
            Auction.updateOne({ _id: auctionId }, { status: 'ongoing' }).then(() => {
                console.log(`${auctionId} started`);
            }).catch(error => {
                console.error(`Failed to update auction ${auctionId}:`, error);
            });
        }
    }


    const delay = endTimeDate.getTime() - Date.now();
    console.log('delay: ', delay);

    if (delay > 0) {
        setTimeout(() => {
            Auction.updateOne({ _id: auctionId }, { $set: { status: 'completed' } }).then(() => {
                io.to(auctionId.toString()).emit('auctionEnded', 'This auction has ended.');

                Auction.findById(auctionId).then(auction => {
                    if (auction && auction.highestBidder) {
                        User.updateOne(
                            { _id: auction.highestBidder },
                            { $push: { itemsOwned: auction._id } }
                        ).then(() => {
                            console.log('Updated itemsOwned for user:', auction.highestBidder);
                        }).catch(error => {
                            console.error('Failed to update itemsOwned for user:', auction.highestBidder, error);
                        });
                    }
                }).catch(error => {
                    console.error('Failed to retrieve auction details:', error);
                });
            }).catch(error => {
                console.error(`Failed to update auction ${auctionId}:`, error);
            });
        }, delay);
    }
    else {
        console.log("here",)
        Auction.updateOne({ _id: auctionId }, { $set: { status: 'completed' } }).then(() => {
            io.to(auctionId.toString()).emit('auctionEnded', 'This auction has ended.');

            Auction.findById(auctionId).then(auction => {
                if (auction && auction.highestBidder) {
                    User.updateOne(
                        { _id: auction.highestBidder },
                        { $push: { itemsOwned: auction._id } }
                    ).then(() => {
                        console.log('Updated itemsOwned for user:', auction.highestBidder);
                    }).catch(error => {
                        console.error('Failed to update itemsOwned for user:', auction.highestBidder, error);
                    });
                }
            }).catch(error => {
                console.error('Failed to retrieve auction details:', error);
            });
        }).catch(error => {
            console.error(`Failed to update auction ${auctionId}:`, error);
        });
    }
}

export const CreateAuction = async (req, res) => {
    const { userId, title, description, startingPrice, startingTime, endingTime } = req.body;

    if (!title || !description || !startingPrice || !startingTime || !endingTime) {
        return res.status(400).json({ message: 'Details missing' });
    }

    try {
        const auction = new Auction({
            title: title, description: description, currentPrice: 0, startingPrice: startingPrice, startingTime: startingTime, endingTime: endingTime, createdBy: userId, status: 'toStart',
        });

        await auction.save();

        const user = await User.findById(userId);
        user.auctionsCreated = [...user.auctionsCreated, auction._id];
        await user.save();

        checkAuctionEndTime(auction);

        res.status(201).json({ message: 'Auction created successfully' });

    } catch (err) {
        console.error("here", err.message);
        res.status(500).send('Server error');
    }
};

export const GetAuctions = async (req, res) => {
    try {
        const { ids } = req.body;
        const foundAuctions = await Auction.find({ _id: { $in: ids } });
        res.json(foundAuctions);
    } catch (error) {
        console.error('Error fetching auction details:', error);
        res.status(500).send('Error fetching auction details');
    }
};

export const GetAllAuctions = async (req, res) => {
    try {
        const allAuctions = await Auction.find();
        res.json(allAuctions);
    } catch (error) {
        console.error('Error fetching all auction details:', error);
        res.status(500).send('Error fetching all auction details');
    }
};

export const SearchAuctions = async (req, res) => {
    const { query } = req.query;
    try {
        if (!query) {
            const allAuctions = await Auction.find();
            res.json(allAuctions);
        }
        else {
            const filteredAuctions = await Auction.find({
                title: { $regex: new RegExp(query, 'i') },
            });
            res.json(filteredAuctions);
        }
    } catch (error) {
        console.error('Error searching:', error);
        res.status(500).send('Error search');
    }



};