import {
    insertPatient,
    fetchPatients,
    fetchPatientById,
    updatePatientById,
    deletePatientById,
    findUserByEmail
} from "../models/PostgreSQL/PatientModels.js"


import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from 'bcryptjs'; 

let saltRounds = 10;

// This controller is for creating or adding Patients data...
export const createPatients = asyncHandler(async (req,res) => {
    const {name , gender,phone,email,password ,date_of_birth, blood_group, allergies, existing_conditions, current_medications, emergency_contact } = req.body;

    if(!name  || !gender || !phone || !email || !password || !date_of_birth || !blood_group  || !existing_conditions || !current_medications) {
        throw new ApiError(400, "Some field are not filled");
    }

    const existsUser = await findUserByEmail(email);
    if (existsUser) throw new ApiError(400, "User with this email already exists");
 

    //hash the plain password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const patient = await insertPatient({name, phone, email, gender, hashedPassword, date_of_birth, blood_group, allergies, existing_conditions, current_medications, emergency_contact});

    if(!patient) throw new ApiError(500, "Something went wrong while creating Patient");

    console.log("Patient created Successfully !!");

    return res.status(201).json({
        patient : patient,
        message : "Patient created successfully"
    });
});

// Promote existing user to patient
export const promoteUserToPatient = asyncHandler(async (req, res) => {
    const { user_id, blood_group, allergies, existing_conditions, current_medications, emergency_contact  } = req.body;

    if (!user_id || !blood_group || !allergies || !existing_conditions || !current_medications || !emergency_contact ) throw new ApiError(400, "User ID and age are required");
    

    const query = `
        INSERT INTO patients(user_id, blood_group, allergies, existing_conditions, current_medications, emergency_contact)
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    const result = await pool.query(query, [user_id, blood_group, allergies, existing_conditions, current_medications, emergency_contact]);

    if (!result.rows[0]) throw new ApiError(500, "Failed to promote user to patient");

    return res.status(201).json(new ApiResponse(201, result.rows[0], "✅ User promoted to patient successfully"));
});


// Get Patient data
export const getPatients = asyncHandler(async (req,res) => {
    const patient = await fetchPatients();
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

    if(updatedData.email){
        const existsUser = await findUserByEmail(updatedData.email);
        if (existsUser) throw new ApiError(400, "User with this email already exists");
    }
 
     
    // ✅ Hash new password if provided
    if(updatedData.password){
        const hashedPassword = await bcrypt.hash(updatedData.password, saltRounds);
        updatedData.password = hashedPassword;
    }

    const patient = await updatePatientById(patient_id, updatedData);

    if(!patient) throw new ApiError(404, "Patient Not Updated");

    return res.status(200).json(new ApiResponse(200, patient, "Patient data updated Successfully"));
});


// Delete Patient
export const deletePatient = asyncHandler(async (req,res) => {
    const patient_id = req.params.id;
    if(!patient_id) throw new ApiError(404, "Patient ID not assign");

    const patient = await deletePatientById(patient_id);

    if(!patient) throw new ApiError(404, "Patient data not found");

    return res.status(200).json(new ApiResponse(200, patient, "Patient Deleted Successfully"));
});

