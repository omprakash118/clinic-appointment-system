import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { pool } from "../config/postgreSQL.js";
import ApiResponse from "../utils/ApiResponse.js";


// ✅ Admin Dashboard(Counts)

export const getDashboardStats = asyncHandler(async (req,res) => {
    const doctorCount = await pool.query("SELECT COUNT(*) FROM doctors");
    const patientCount = await pool.query("SELECT COUNT(*) FROM patients");
    const appointmentCount = await pool.query("SELECT COUNT(*) FROM appointments");

    return res.status(200).json(new ApiResponse(200, {
            doctors : doctorCount.rows[0].count,
            patient : patientCount.rows[0].count,
            appointment : appointmentCount.rows[0].count
        }, "✅ Dashboard stats fetched successfully"));
});


// ✅ Get All Data (Overview)
export const getSystemOverview = asyncHandler(async (req, res) => {
    const doctors = await pool.query("SELECT * FROM doctors");
    const patients = await pool.query("SELECT * FROM patients");
    const appointments = await pool.query("SELECT * FROM appointments");

    return res.status(200).json(
    new ApiResponse(200, {
        doctors: doctors.rows,
        patients: patients.rows,
        appointments: appointments.rows
        }, "✅ System overview fetched successfully")
    );
});