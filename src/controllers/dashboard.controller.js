import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { pipeline } from "stream"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const userId = req.user?._id
    
    if(!userId){
        throw new ApiError(404,"Invalid user")
    }

    const channelStats = await User.aggregate([
        {
            $match : {
                _id : userId
            }
        },
        {
           $lookup : {
            from : "videos",
            localField : "_id",
            foreignField : "owner",
            as : "allVideos",
            pipeline : [
                {
                    $project : {
                        videoFile : 1,
                        thumbnail : 1,
                        title : 1,
                        description : 1,
                        duration : 1,
                        views : 1
                    }
                }
            ]
            }
        },
        {
            $lookup : {
                from : "subscriptions",
                localField : "_id",
                foreignField : "channel",
                as : "subscribers"
            }
        },
        {
            $lookup : {
                from : "likes",
                let : { videosIds : "$allVideos._id" },
                pipeline : [
                    {
                        $match : {
                            $expr : {
                                $in : ["$video", "$$videosIds"]
                            }
                        }
                    }
                ],
                as : "videoLikes"
            }
        },
        {
            $addFields : {
                totalViews : { 
                    $sum : "$allVideos.views" 
                },
                totalVideos : { 
                    $size : "$allVideos" 
                },
                totalSubscribers : { 
                    $size : "$subscribers" 
                },
                totalLikes : {
                    $size : "$videoLikes"
                }
            }
        },
        {
            $project: {
                username : 1,
                email : 1,
                fullName : 1,
                avatar : 1,
                coverImage : 1,
                allVideos: 1,
                totalViews: 1,
                totalVideos: 1,
                totalSubscribers: 1,
                totalLikes: 1 
            }
        }
    ])

    res.json(
        new ApiResponse(
            200,
            channelStats,
            "Channel stats fetched successfully"
        )
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const userId = req.user?._id

    if(!userId){
        throw new ApiError(404, "No such user exists")
    }

    const channelVideos = await Video.find(
        {
            owner : userId
        }
    )

    res.json(
        new ApiResponse(
            200,
            channelVideos,
            "All videos uploaded by user fetched successfully"
        )
    )
})

export {
    getChannelStats, 
    getChannelVideos
    }