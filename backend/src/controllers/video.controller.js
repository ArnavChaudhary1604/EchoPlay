import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import {deleteFromCloudinary, uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    //convert string data to int
    //calculate skip
    //Use agrregation pipeline on videos
        //$match
        //$lookup
        //.limit & .skip
    //think abt owner field in videos
    //send res
    
    const intPage = parseInt(page)
    const intLimit = parseInt(limit)

    const skip = (intPage - 1)*intLimit

    const sortField = sortBy || "createdAt";
    const sortDirection = sortType === "-1" ? -1 : 1;

   const allVideos = await Video.aggregate([
        {   
            $match : {
                owner : mongoose.Types.ObjectId.isValid(userId) ? 
                new mongoose.Types.ObjectId(userId) : null,
                ...(query && {
                    $or : [
                        {
                            title: {
                                $regex : query, $options: "i"
                            }
                        },
                        {
                            description: {
                                $regex : query,
                                $options: "i"
                            }
                        }
                    ]
                }
                )
            }
        },
        {
            $sort : {
                [sortField]: sortDirection
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "owner",
                foreignField : "_id",
                as : "ownerDetails",

                pipeline : [
                    {
                        $project : {
                            username : 1,
                            email : 1,
                            fullName : 1,
                            avatar : 1,
                            coverImage : 1
                        }
                    }
                ]
            }
        },
        {
            $project : {
                videoFile : 1,
                thumbnail : 1,
                owner : 1,
                title : 1,
                description : 1,
                duration : 1,
                views : 1,
                isPublished : 1,
                createdAt : 1,
                ownerDetails : { $arrayElemAt: ["$ownerDetails", 0]}
            }
        },
        {
            $skip : skip
        },
        {
            $limit : intLimit
        }
   ])

   res.json(
    new ApiResponse(
        200,
        allVideos,
        "Video details fetched successfully"
    )
   )

})//tested
 
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    // get userId from req.params
    // get local filepath from req.files for videoFile and thumbnail
    // use uploadOnCloudinary
    // add data in video db

    const userId = req.user?._id

    const user = await User.findById(userId)

    if(!user){
        throw new ApiError(404, "No such user exists")
    }

    let videoFileLocalPath
    if(req.files && Array.isArray(req.files.videoFile) && req.files.videoFile.length > 0){
        videoFileLocalPath = req.files.videoFile[0].path
    }

    let thumbnailLocalPath
    if(req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0){
        thumbnailLocalPath = req.files.thumbnail[0].path
    }

    if(!(videoFileLocalPath && thumbnailLocalPath)){
        throw new ApiError(400 , "VideoFile & thumbnail both are required")
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    const newVideo = await Video.create(
        {
            videoFile : videoFile.url,
            thumbnail : thumbnail.url,
            owner: userId,
            title : title,
            description : description? description : " ",
            duration: videoFile.duration,
            views : 0,
            isPublished : true
        }
    )

    res.json(
        new ApiResponse(
            200,
            newVideo,
            "Video uploaded successfully"
        )
    )
})//tested
 
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404, "No such video exists")
    }

    res.json(
        new ApiResponse(
            200,
            video,
            "Video details fetched successfully"
        )
    )
})//tested

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    // get details to be updated from req.body and req.files
    // findbyid and update
    const { title, description } = req.body

    //console.log(req.file)

    let thumbnailLocalPath
    if(req.file){
        thumbnailLocalPath = req.file.path
    }

    let thumbnail
    let thumbnailUrl
    let oldThumbnailUrl
    if(thumbnailLocalPath){
        thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
        //console.log("Cloudinary Response:", thumbnail)
        thumbnailUrl = thumbnail.url

        const existingVideo = await Video.findById(videoId).select("thumbnail")
        if (existingVideo) {
            oldThumbnailUrl = existingVideo.thumbnail
        }
    }

    const updateFields = {}
    if (title) updateFields.title = title
    if (description) updateFields.description = description
    if (thumbnailUrl) updateFields.thumbnail = thumbnailUrl

    if (Object.keys(updateFields).length === 0) {
        throw new ApiError(400, "No fields provided to update")
    }


    const updatedVideo = await Video.findByIdAndUpdate(
        videoId ,
        {
            $set : updateFields
        },
        {
            new : true
        }
    )

    if(thumbnailUrl){
        await deleteFromCloudinary(oldThumbnailUrl)
    }

    res.json(
        new ApiResponse(
            200,
            updatedVideo,
            "Video details updated successfully"
        )
    )
})//tested

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    const deletedVideo = await Video.findByIdAndDelete(videoId)

    if(!deletedVideo){
        throw new ApiError(400, "No such video exist")
    }

    if (deletedVideo.videoFile) await deleteFromCloudinary(deletedVideo.videoFile, "video")
    if (deletedVideo.thumbnail) await deleteFromCloudinary(deletedVideo.thumbnail)

    
    res.json(
        new ApiResponse(
            200,
            deletedVideo,
            "Video deleted successfully"
        )
    )
})//tested

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    const updatedVideo = await Video.findById(videoId)

    if (!updatedVideo) {
        throw new ApiError(404, "No such video exists")
    }

    updatedVideo.isPublished = !updatedVideo.isPublished;
    await updatedVideo.save()

    res.json(
        new ApiResponse(
            200,
            updatedVideo,
            "Publish status"
        )
    )
})//tested

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}