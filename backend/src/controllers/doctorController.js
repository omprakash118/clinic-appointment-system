import { insertDoctor, 
        fetchDoctors, 
        fetchDoctorById,
        updateDoctorById,
        deleteDoctorById } from "../models/PostgreSQL/DoctorModels.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from 'bcryptjs'; 

const saltRounds = 10;

// This controller is for creating or adding Doctor data..
export const createDoctor = asyncHandler(async (req,res) => {

    const { name, specialization, phone, email , password} = req.body;
    if(!name || !specialization || !phone || !email || !password) throw new ApiError(400, "some field are not filled");

    // hash the plain password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // call model to insert doctor
    const doctor = await insertDoctor({ name, specialization, phone, email ,hashedPassword});

    if(!doctor){
        throw new ApiError(500,"Somthing went wrong while creating Doctor");
    }

    console.log("Doctor created Successfully !!");

    return res.status(201).json({
        doctor : doctor ,
        message : "Doctor created successfully"
    });
});

// Get Doctors data
export const getDoctors = asyncHandler(async (req,res) => {
    const doctors = await fetchDoctors();
    return res.status(200).json(new ApiResponse(200 , doctors, "All admins fetch successfully"));
});

// Get Doctor By ID
export const getDoctorById = asyncHandler(async (req,res) => {
    const doctor_id = req.params.id;
    if(!doctor_id) new ApiError(404, "Doctor Id not found");

    const doctor = await fetchDoctorById(doctor_id);
    if(!doctor) throw new ApiError(404, "Doctor not fetched");

    return res.status(200).json(new ApiResponse(200, doctor , "Doctor fetched successfully"));
});

// Update Doctor
export const updateDoctor = asyncHandler(async (req,res) => {
    const doctor_id = req.params.id;
    const updatedData = req.body;

    if(!doctor_id) throw new ApiError(404, "Doctor ID not assign");
    if(!updatedData) throw new ApiError(404, "Doctor Data not found");

    const doctor = await updateDoctorById(doctor_id, updatedData);

    if(!doctor) throw new ApiError(404, "Doctor not found");

    return res.status(200).json(new ApiResponse(200, doctor, "Doctor data updated successfully"));
});


// Delete doctor
export const deleteDoctor = asyncHandler(async (req, res) => {
    const doctor_id = req.params.id;
    if(!doctor_id) throw new ApiError(404, "Doctor ID not assign");
    
    const doctor = await deleteDoctorById(doctor_id);
    
    if(!doctor) throw new ApiError(404, "Doctor Data not found");

    return res.status(200).json(new ApiResponse(200, doctor , "Doctor deleted successfully"));
});