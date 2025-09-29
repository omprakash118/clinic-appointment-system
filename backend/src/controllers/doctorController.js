import { insertDoctor, 
        fetchDoctors, 
        fetchDoctorById,
        updateDoctorById,
        deleteDoctorById,
        findUserByEmail } from "../models/PostgreSQL/DoctorModels.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from 'bcryptjs'; 
import { pool } from "../config/postgreSQL.js";

const saltRounds = 10;

// This controller is for creating or adding Doctor data..
export const createDoctor = asyncHandler(async (req,res) => {

    const { name,  phone, email , password, gender, date_of_birth, specialization, license_number, qualification, experience_years, consultation_fee, availability} = req.body;
    if(!name || !specialization || !phone || !email || !password || !date_of_birth || !qualification || !experience_years || !consultation_fee){
        throw new ApiError(400, "some field are not filled");
    }

    const existsUser = await findUserByEmail(email);
    if (existsUser) throw new ApiError(400, "User with this email already exists");
 
    // hash the plain password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // call model to insert doctor
    const doctor = await insertDoctor({ name, phone, email ,hashedPassword, gender , date_of_birth , specialization, license_number, qualification, experience_years, consultation_fee, availability});

    if(!doctor){
        throw new ApiError(500,"Somthing went wrong while creating Doctor");
    }

    console.log("Doctor created Successfully !!");

    return res.status(201).json({
        doctor : doctor ,
        message : "Doctor created successfully"
    });
});

// Promote existing user to doctor
export const promoteUserToDoctor = asyncHandler(async (req,res) => {
    const { user_id , specialization, license_number, qualification, experience_years, consultation_fee, availability} = req.body;

    if(!user_id || !specialization) throw new ApiError(400, "User ID and Specialization are required");

    // Insert into doctor table Only
    const query = `
        INSERT INTO doctors(user_id, specialization, license_number, qualification, experience_years, consultation_fee, availability)
        VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;
    const result = await pool.query(query, [user_id, specialization, license_number, qualification, experience_years, consultation_fee, availability]);

    if(!result.rows[0]) throw new ApiError(500, "Failed to promote user to doctor");

      return res.status(201).json(new ApiResponse(201, result.rows[0], "✅ User promoted to doctor successfully"));
});

// Get Doctors data
export const getDoctors = asyncHandler(async (req,res) => {
    const doctors = await fetchDoctors();
    return res.status(200).json(new ApiResponse(200 , doctors, "All Doctors fetch successfully"));
});

// Get Doctor By ID
export const getDoctorById = asyncHandler(async (req,res) => {
    const doctor_id = req.params.id;
    if(!doctor_id) throw new ApiError(404, "Doctor Id not found");

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

    if(updatedData.email){
        const existsUser = await findUserByEmail(updatedData.email);
        if (existsUser) throw new ApiError(400, "User with this email already exists");
    }

    // ✅ Hash new password if provided
    if(updatedData.password){
        const hashedPassword = await bcrypt.hash(updatedData.password, saltRounds);
        updatedData.password = hashedPassword;
    }

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