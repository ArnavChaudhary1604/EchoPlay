import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    let pageInt = parseInt(page, 10) || 1
    let limitInt = parseInt(limit, 10) || 10
    let skipInt = (pageInt-1)*limitInt

    const allVideoComments = await Comment.find(
        {
            video : videoId
        }
    ).populate("owner","username fullName avatar").skip(skipInt).limit(limitInt)

    res.json(
        new ApiResponse(
            200,
            allVideoComments,
            "All comments fetched successfully"
        )
    )
})//tested

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {content} = req.body

    const userId = req.user?._id

    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment content cannot be empty");
    }
    
    const newComment = await Comment.create({
        content : content,
        video : videoId,
        owner : userId
    })

    res.json(
        new ApiResponse(
            201,
            newComment,
            "Comment created successfully"
        )
    )

})//tested

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {content} = req.body

    if (!commentId) {
        throw new ApiError(401, "No such comment exists");
    }

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment content cannot be empty");
    }

    const updatedConmment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set : {
               content : content 
            }
        },
        { new : true }
    )

    res.json(
        new ApiResponse(
            200,
            updatedConmment,
            "Comment content updated successfully"
        )
    )
})//tested 

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params

    if (!commentId) {
        throw new ApiError(401, "No such comment exists");
    } 

    const deletedComment = await Comment.findByIdAndDelete(commentId)

    res.json(
        new ApiResponse(
            200,
            deletedComment,
            "The comment is deleted successfully"
        )
    )
})//tested

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }