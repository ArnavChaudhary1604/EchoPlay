import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    // get content from req.body
    // get userId for owner from req.params

    const { content } = req.body
    const userId =req.user?._id

    if(!content || !userId || !content.trim()){
        throw new ApiError(400, "Both content and userId are req")
    }

    const tweet = await Tweet.create({
        owner : userId,
        content : content.trim()
    })

    res.json(
        new ApiResponse(
            201,
            tweet,
            "Tweet created successfully"
        )
    )
})//tested 

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params

    const allTweets = await Tweet.find(
        {    
            owner : userId
        }
    )
    
    res.json(
        new ApiResponse(
            200,
            allTweets,
            "All user tweets fetched successfully"
        )
    )
})//tested

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {content} = req.body
    const {tweetId} = req.params

    if(!content || !content.trim()){
        throw new ApiError(400, "Content is required")
    }

    const tweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set : {
                content : content.trim()
            }
        },
        { new : true }
    )

    res.json(
        new ApiResponse(
            200,
            tweet,
            "Tweet updated successfully"
        )
    )
})//tested

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)

    if(!deletedTweet){
        throw new ApiError(404, "Tweet not found")
    }

    res.json(
        new ApiResponse(
            200,
            deletedTweet,
            "Tweet deleted successfully"
        )
    )
})//tested

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}