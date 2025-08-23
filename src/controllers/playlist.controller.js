import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    if(!(name && description)){
        throw new ApiError(400, "Playlist Name & description both are required")
    }
    //TODO: create playlist

    const userId = req.user?._id
    
    if(!userId){
        throw new ApiError(404, "No such user exists")
    }

    const newPlaylist = await Playlist.create({
        name : name,
        description : description,
        owner : userId,
        videos : []
    })

    res.json(
        new ApiResponse(
            201,
            newPlaylist,
            "Playlist created successfully"
        )
    )
})//tested

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    if(!userId){
        throw new ApiError(404, "No such user exists")
    }

    const userPlaylists = await Playlist.find(
        {
            owner : userId
        }
    )

    res.json(
        new ApiResponse(
            200,
            userPlaylists,
            "All playlists of user fetched successfully"
        )
    )
})//tested

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    if(!playlistId){
        throw new ApiError(404, "No such playlist exists")
    }

    const playlist = await Playlist.findById(playlistId)

    res.json(
        new ApiResponse(
            200,
            playlist,
            "Playlist fetched by id successfully"
        )
    )
})//tested

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $push : {
                videos : videoId
            }
        },
        { new : true }
    )

    if(!updatedPlaylist){
        throw new ApiError(404, "Playlist not found")
    }

    res.json(
        new ApiResponse(
            200,
            updatedPlaylist,
            "Video added successfully"
        )
    )
})//tested
 
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull : {
                videos : videoId
            }
        },
        { new : true }
    )

    res.json(
        new ApiResponse(
            200,
            updatedPlaylist,
            "Video removed from playlist successfully"
        )
    )

})//tested

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId)

    if (!deletedPlaylist){
        throw new ApiError(404, "Playlist not found");
    }

    res.json(
        new ApiResponse(
            200,
            deletedPlaylist,
            "Playlist deleted successfully"
        )
    )
})//tested

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if(!(name || description)){
        throw new ApiError(400, "Either playlist Name or description is required")
    }

    const updateFields = {}
    if(name){
        updateFields.name = name
    }
    if(description){
        updateFields.description = description
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set : updateFields
        },
        { new : true }
    )

    if (!updatedPlaylist){
        throw new ApiError(404, "Playlist not found")
    }

    res.json(
        new ApiResponse(
            200,
            updatedPlaylist,
            "Playlist details updated successfully"
        )
    )
})//tested

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}