import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import { channel, subscribe } from "diagnostics_channel"
import { console } from "inspector"


const toggleSubscription = asyncHandler(async (req, res) => {
    console.log("toggleSubscription called")
    const {channelId} = req.params
    // TODO: toggle subscription
    const userId = req.user?._id
    
    if(!userId){
        throw new ApiError(404, "No such user exists")
    }
    console.log(userId)

    const subscriptionStatus = await Subscription.findOne(
        {
            subscriber : userId,
            channel : channelId
        }
    )

    if(!subscriptionStatus){
        const subscribed = await Subscription.create({
            subscriber : userId,
            channel : channelId
        })

        res.json(
            new ApiResponse(
                201,
                subscribed,
                "User subscribed successfully"
            )
        )
    }
    else{
        const unSubscribed = await Subscription.findOneAndDelete({
            subscriber : userId,
            channel : channelId
        })

        res.json(
            new ApiResponse(
                200,
                unSubscribed,
                "User unsubscribed successfully"
            )
        )
    }

})//tested

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
            
    const subscriberList =  await Subscription.find(
        {
            channel : channelId
        }
    ).populate("subscriber", "username")

    res.json(
        new ApiResponse(
            200,
            subscriberList,
            "Subscriber List fetched successfully"
        )
    )
})//tested 

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    const subscribedList =  await Subscription.find(
        {
            subscriber : subscriberId
        }
    ).populate("channel", "username")

    res.json(
        new ApiResponse(
            200,
            subscribedList,
            "Subscriber List fetched successfully"
        )
    )
})//tested

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}