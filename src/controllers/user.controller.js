import asyncHandler from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken= async(userId) =>{
    try
    {
        const existedUser= await User.findById(userId)
        const accessToken = existedUser.generateAccessToken()
        const refreshToken = existedUser.generateRefreshToken()

        existedUser.refreshToken = refreshToken
        await existedUser.save({validateBeforeSave : false})

        return {accessToken, refreshToken}
    }
    catch(error){
       throw new ApiError(500,"Something went wrong while generating refresh & access token") 
    }
}


const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - empty
    // check if user already exist: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    //extract data point from req.body
    const {fullName, email, username, password} =req.body;
    
    // console.log("Req :", req);
    // console.log("Req.body :", req.body)
    // console.log("email: ", email);

    //check wheter all fields are present or not
    if(
        [fullName ,email, username, password].some((field) => field?.trim() === "")
    )
        {
            throw new ApiError(400, "All fields are required")
        };

    //check if the username or email exists
    const existedUser= await User.findOne({
        $or: [{ username }, { email }]
    })    

    if(existedUser){
        throw new ApiError(409, "User with email or username alrady exists")
    }

    // console.log("Req.files :", req.files)
    // get localPath of avatar and coverImage
    // const avatarLocalPath = req.files?.avatar[0]?.path;
    let avatarLocalPath;
    if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length >0){
        avatarLocalPath=req.files.avatar[0].path
    }

    // const coverImageLocalPath= req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }
    
    //check if avatar is present
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }
    
    //create object and push in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    
    //remove password and refreshToken from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})

const loginUser = asyncHandler( async (req,res) => {
    // get email/username & password from req.body
    // check whether username/email is provided
    // validate if such user exists
    // validate the password provided
    // generate & provide the user device with access token and refresh token
    // provide login access

    const {email, username, password} = req.body;

    if(!(email || username)){
        throw new ApiError(400,"email/username is required")
    }

    const existedUser=await User.findOne({
        $or: [{ username },{ email }]
    })

    if(!existedUser){
        throw new ApiError(404,"User not found")
    }

    const isPasswordValid= await existedUser.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"Password is incorrect")
    }

    const {accessToken, refreshToken}= await generateAccessAndRefreshToken(existedUser._id)

    const loggedInUser = await User.findById(existedUser._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )
})

const logoutUser = asyncHandler( async (req,res) => {
    // find user
    // clear cookies
    // make refreshToken null
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
            {
                new: true
            }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json( new ApiResponse(200,{},"User logged out"))
})

const refreshAccessToken = asyncHandler( async (req,res) => {
    // get refresToken from cookies
    // validate it with db
    // generate new accessToken
    // provide accessToken & refreshToken to user in cookies

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedRefreshToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedRefreshToken?._id)
    
        if(!user){
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
    
})



export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}