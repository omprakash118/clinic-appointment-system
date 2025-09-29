import {
    fetchUsers,
    fetchUserById,
    updateUserById,
    insertUser,
    deleteUserById,
    findUserByEmail
} from "../models/PostgreSQL/UserModels.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";

let saltRounds = 10;

// Create User
export const createUsers = asyncHandler(async (req,res) => {
    const { name, phone, email, gender, password, role, date_of_birth } = req.body;

    if(!name || !phone || !email || !gender || !password || !role || !date_of_birth) throw new ApiError(400, "ALL Field required");

    const existsUser = await findUserByEmail(email);
    if (existsUser) throw new ApiError(400, "User with this email already exists");
 

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await insertUser({name , phone, email, gender, hashedPassword, role, date_of_birth});

    if(!user){
        throw new ApiError(500,"Somthing went wrong while creating User");
    }

    console.log("User created Successfully !!");

    return res.status(201).json({
        user : user ,
        message : "User created successfully"
    });
});


// Get Users
export const getUsers = asyncHandler(async (req,res) => {
    const users = await fetchUsers();
    return res.status(200).json(new ApiResponse(200 , users, "All Users fetch successfully"));
});


// Get User By ID
export const getUserById = asyncHandler(async (req,res) => {
    const id = req.params.id;
    if(!id) throw new ApiError(404, "ID not found");

    const user = await fetchUserById(id);
    if(!user) throw new ApiError(404, "User not found");

    return res.status(200).json(new ApiResponse(200, user, "✅ User Fetched Successfully"));
});


// Update Users
export const updateUser = asyncHandler(async (req,res) => {
    const id = req.params.id;
    if(!id) throw new ApiError(404, "Id not found");

    const updatedData = req.body;
    if(!updatedData) throw new ApiError(404, "User data not assign");

    // ✅ Hash new password if provided
    if(updatedData.password){
        const hashedPassword = await bcrypt.hash(updatedData.password, saltRounds);
        updatedData.password = hashedPassword;
    }
    
    const userData = await updateUserById(id, updatedData);

    if(!userData) throw new ApiError(404, "❌ User not updated");

    return res.status(200).json(new ApiResponse(200, userData , "✅ User Updated Successfully"));
});


// Delete Users
export const deleteUsers = asyncHandler(async (req,res) => {
    const id = req.params.id;
    if(!id) throw new ApiError(404, "ID not assign");
    const deletedUser = await deleteUserById(id);
    if(!deletedUser) throw new ApiError(404, "❌ User not deleted");
    return res.status(200).json(new ApiResponse(200, deletedUser, "✅ User deleted Successfully"));
});