import {
    insertPatient,
    fetchPatient,
    fetchPatientById,
    updatePatientById,
    deletePatientById
} from "../models/PostgreSQL/UserModels.js"


import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from 'bcryptjs'; 

let saltRounds = 10;

// This controller is for creating or adding Patients data...
export const createPatients = asyncHandler(async (req,res) => {
    const {name , age, gender,phone,email,password} = req.body;

    if(!name || !age || !gender || !phone || !email || !password) throw new ApiError(400, "Some field are not filled")

    //hash the plain password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const patient = await insertPatient({name , age, gender,phone,email,hashedPassword});

    if(!patient) throw new ApiError(500, "Something went wrong while creating Patient");

    console.log("Doctor created Successfully !!");

    return res.status(201).json({
        patient : patient,
        message : "Patient created successfully"
    });
});

// Get Patient data
export const getPatients = asyncHandler(async (req,res) => {
    const patient = await fetchPatient();
    return res.status(200).json(new ApiResponse(200, patient, "All Patient fetched successfully"));
})

// Get Patient Data By ID
export const getPatientById = asyncHandler(async (req,res) => {
    const patient_id = req.params.id;
    if(!patient_id) throw new ApiError(404, "Patient Id not found");

    const patient = await fetchPatientById(patient_id);
    if(!patient) throw new ApiError(404, "Patient Not fetched");

    return res.status(200).json(new ApiResponse(200, patient, "Patient fetch successfully"));
});


// Update Patients
export const updatePatient = asyncHandler(async (req,res) => {
    const patient_id = req.params.id;
    const updatedData = req.body;

    if(!patient_id) throw new ApiError(404, "Patient ID Not assign");
    if(!updatedData) throw new ApiError(404, "Patient data not found");

    const patient = await updatePatientById(patient_id, updatedData);

    if(!patient) throw new ApiError(404, "Patient Not Updated");

    return res.status(200).json(new ApiResponse(200, patient, "Patient data updated Successfully"));
});


// Delete doctor
export const deletePatient = asyncHandler(async (req,res) => {
    const patient_id = req.params.id;
    if(!patient_id) throw new ApiError(404, "Patient ID not assign");

    const patient = await deletePatientById(patient_id);

    if(!patient) throw new ApiError(404, "Patient data not found");

    return res.status(200).json(new ApiResponse(200, patient, "Patient Deleted Successfully"));
})

