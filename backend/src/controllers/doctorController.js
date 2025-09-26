import { insertDoctor, 
        fetchDoctors, 
        fetchDoctorById,
        updateDoctorById,
        deleteDoctorById } from "../models/PostgreSQL/DoctorModels.js";

import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse.js";


// This controller is for creating or adding Doctor data..
export const createDoctor = asyncHandler(async (req,res) => {

    const doctor = await insertDoctor(req.body);

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
    const doctor_id = req.params;
    if(!doctor_id) new ApiError(404, "Doctor Id not found");

    const doctor = await fetchDoctorById(doctor_id);
    if(!doctor) throw new ApiError(404, "Doctor not fetched");

    return res.status(200).json(new ApiResponse(200, doctor , "Doctor fetched successfully"));
});

// Update Doctor
export const updateDoctor = asyncHandler(async (req,res) => {
    const doctor_id = req.params;
    const updatedData = req.body;

    if(!doctor_id) throw new ApiError(404, "Doctor ID not assign");
    if(!updatedData) throw new ApiError(404, "Doctor Data not found");

    const doctor = await updateDoctorById(doctor_id, updatedData);

    if(!doctor) throw new ApiError(404, "Doctor not found");

    return res.status(200).json(new ApiResponse(200, doctor, "Doctor data updated successfully"));
});


// Delete doctor
export const deleteDoctor = asyncHandler(async (req, res) => {
    const doctor_id = req.params;
    if(!doctor_id) throw new ApiError(404, "Doctor ID not assign");
    
    const doctor = await deleteDoctorById(doctor_id);
    
    if(!doctor) throw new ApiError(404, "Doctor Data not found");

    return res.status(200).json(new ApiResponse(200, doctor , "Doctor deleted successfully"));
});