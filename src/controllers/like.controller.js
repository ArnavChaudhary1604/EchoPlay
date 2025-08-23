import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const userId = req.user?._id

    if(!userId){
        throw new ApiError(404, "No such user exists");
    }

    const isLiked = await Like.findOneAndDelete(
        {
            video : videoId,
            likedBy : userId
        }
    )

    if(isLiked){
        return res.json(
            new ApiResponse(
                200,
                isLiked,
                "Unliked the video successfully"
            )
        )
    }
    
    const liked = await Like.create({
            video : videoId,
            likedBy : userId
        })

        res.json(
            new ApiResponse(
                201,
                liked,
                "Video Liked by user"
            )
        )
})//tested
 
const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const userId = req.user?._id

    if(!userId){
        throw new ApiError(404, "No such user exists");
    }

    const isLiked = await Like.findOneAndDelete(
        {
            comment : commentId,
            likedBy : userId
        }
    )

    if(isLiked){
        return res.json(
            new ApiResponse(
                200,
                isLiked,
                "Unliked the comment successfully"
            )
        )
    }
    
    const liked = await Like.create({
            comment : commentId,
            likedBy : userId
        })

        res.json(
            new ApiResponse(
                201,
                liked,
                "Comment Liked by user"
            )
        )
})//tested

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const userId = req.user?._id

    if(!userId){
        throw new ApiError(404, "No such user exists");
    }

    const isLiked = await Like.findOneAndDelete(
        {
            tweet : tweetId,
            likedBy : userId
        }
    )

    if(isLiked){
        return res.json(
            new ApiResponse(
                200,
                isLiked,
                "Unliked the tweet successfully"
            )
        )
    }
    
    const liked = await Like.create({
            tweet : tweetId,
            likedBy : userId
        })

        res.json(
            new ApiResponse(
                201,
                liked,
                "Tweet Liked by user"
            )
        )
}
)//tested

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user?._id

    if(!userId){
        throw new ApiError(404, "No such user exists")
    }

    const allLikedVideos = await Like.find(
        {
            likedBy : userId,
            video : { $exists : true }
        }
    ).populate({
        path: "video",
        select: "title thumbnail views owner",
        populate: {
            path: "owner",
            select: "username"
        }
    })

    res.json(
        new ApiResponse(
            200,
            allLikedVideos,
            "All liked vides fetched successfully"
        )
    )
})//tested

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}