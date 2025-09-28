import {
    insertAppointment,
    fetchAppointments,
    fetchAppointmentsById,
    updateAppointmentById,
    deleteAppointmentById
} from "../models/PostgreSQL/AppointmentModels.js";

import { pool } from "../config/postgreSQL.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// Schedule appointment
export const scheduleAppointment = asyncHandler(async (req,res) => {
    const { doctor_id, patient_id, appointment_date, status } = req.body;

    if(!doctor_id || !patient_id || !appointment_date) throw new ApiError(400, "Doctor, Patient , and Date are required");

    
    // ✅ Check if doctor exists
    const doctorCheck = await pool.query("SELECT doctor_id FROM doctors WHERE doctor_id = $1", [doctor_id]);
    if (doctorCheck.rows.length === 0) {
          throw new ApiError(404, `Doctor with ID ${doctor_id} not found`);
    }

    // ✅ Check if patient exists
    const patientCheck = await pool.query("SELECT patient_id FROM patients WHERE patient_id = $1", [patient_id]);
    if (patientCheck.rows.length === 0) {
          throw new ApiError(404, `Patient with ID ${patient_id} not found`);
    }

    // ✅ (Optional) Prevent double-booking at the same time for same doctor
    const conflictCheck = await pool.query(
        `SELECT doctor_id FROM appointments 
         WHERE doctor_id = $1 AND appointment_date = $2`,
        [doctor_id, appointment_date]
    );
    if (conflictCheck.rows.length > 0) {
        throw new ApiError(400, "Doctor is already booked at this time");
    }
    const newAppointment = await insertAppointment({
        doctor_id,
        patient_id,
        appointment_date,
        status : status || "pending",
    });

    if(!newAppointment) throw new ApiError(404, "Appointment not created");

    return res.status(201).json(new ApiResponse(200, newAppointment , "✅ Appointment scheduled successfully"));
});


// Get all appointments
export const getAppointments = asyncHandler(async (req,res) => {
    const appointments = await fetchAppointments();
    if(!appointments) throw new ApiError(404, "Appointment not found");

    return res.status(200).json(new ApiResponse(200, appointments , "Appointment found successfully"));
})


// Get single appointment
export const getAppointmentById = asyncHandler(async (req,res) => {
    const appointment_id = req.params.id;
    if(!appointment_id) throw new ApiError(404, "Appointment ID not assign");

    const appointment = await fetchAppointmentsById(appointment_id);
    if(!appointment) throw new ApiError(404, "Appointment not found");

    return res.status(200).json(new ApiResponse(200, appointment, "Appoinment data found successfully"));
});



// Update appointment (reschedule or update status)
export const updateAppointmen = asyncHandler(async (req,res) => {
    const appointment_id = req.params.id;
    const updatedData = req.body;

    if(!appointment_id) throw new ApiError(404, "Appointment ID not assign");
    if(!updatedData) throw new ApiError(404, "Appointment Updated data not Found");
    
    const appointment = await updateAppointmentById(appointment_id, updatedData);
    if(!appointment) throw new ApiError(404, "Appointment not found");
    
    return res.status(200).json(new ApiResponse(200, appointment, "Appointment Updated.."));
})


// Cancel appointment
export const cancelAppointment = asyncHandler(async (req,res) => {
    const appointment_id = req.params.id;
    if(!appointment_id) throw new ApiError(404, "Appointment ID not assign");
    
    const appointment = await deleteAppointmentById(appointment_id);
    if(!appointment) throw new ApiError(404, "Appointment not found");
    
    return res.status(200).json(new ApiResponse(200, appointment, "❌ Appointment cancelled"));
})