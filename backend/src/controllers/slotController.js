import DoctorSlotsModel from "../models/mongo/DoctorSlotsModel.js";
import { pool } from "../config/postgreSQL.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getUserInformation = async (user_id) => {
  if (!user_id) throw new ApiError(404, "User ID not found");

  const userData = await pool.query(
    `SELECT id, name, email, phone 
     FROM users 
     WHERE id = $1`,
    [user_id]
  );
  return userData.rows[0] || null;
};


// 📌 Get booked slots for a doctor on a date
export const getBookedSlots = asyncHandler(async (req,res) => {
    const { doctorId , slotDate } = req.query;

    if (!doctorId || !slotDate) throw new ApiError(400, "doctorID and slotDate not assign");
    
    const bookedSlots = await DoctorSlotsModel.find({ doctorId, slotDate });
    
    if (!bookedSlots || bookedSlots.length === 0) {
        throw new ApiError(404, "No booked slots found");
    }

    // 2. Fetch doctor info from PostgreSQL
    const doctorResult = await pool.query(
        `SELECT doctor_id, user_id, specialization, qualification 
         FROM doctors 
         WHERE doctor_id = $1`,
        [doctorId]
    );

    // Get Doctor Data from doctor table
    const doctorData = doctorResult.rows[0] || null;
    // Get doctor information from user Table
    const doctorUser = await getUserInformation(doctorData.user_id);
    
    // Get patient Id from the booked Slots
    const patient_id = bookedSlots.map(slot => slot.bookedBy);
    // Get Patient User id from the patient table
    const patientData = await pool.query(
            `SELECT user_id FROM patients 
             WHERE patient_id = $1`,
             patient_id
    );

    // Get the patient information from the user Table
    const patientInfo = await getUserInformation(patientData.rows[0].user_id);

    return res.status(200).json(
        new ApiResponse(200, {
        bookedSlots,
          doctor : {
            ...doctorUser,
            specialization : doctorData.specialization,
            qualification : doctorData.qualification
          },
          patient : patientInfo
        }, "Booked slots fetched successfully")
  );
}); 



// 📌 Book a new slot
export const bookSlot = asyncHandler(async (req, res) => {
  const { doctorId, slotDate, startTime, endTime, patientId } = req.body;

  if (!doctorId || !slotDate || !startTime || !endTime || !patientId) {
    throw new ApiError(400, "All fields are required");
  }

  // 1. Check doctor exists in doctors table
  const doctorResultDoctor = await pool.query(
    `SELECT doctor_id, user_id, specialization 
     FROM doctors 
     WHERE doctor_id = $1`,
    [doctorId]
  );
  if (doctorResultDoctor.rows.length === 0) {
    throw new ApiError(404, "Doctor not found");
  }
  const doctorData = doctorResultDoctor.rows[0];

  // 2. Check patient exists in patients table
  const patientResultPatient = await pool.query(
    `SELECT patient_id, user_id 
     FROM patients 
     WHERE patient_id = $1`,
    [patientId]
  );
  if (patientResultPatient.rows.length === 0) {
    throw new ApiError(404, "Patient not found");
  }
  const patientUserId = patientResultPatient.rows[0].user_id;
  
  // 3. Fetch doctor user details
  const doctorResult = await getUserInformation(doctorData.user_id);
  
  // 4. Fetch patient user details
  const patientResult =  await getUserInformation(patientUserId);

  // 5. Check if slot already booked in Mongo
  const existingSlot = await DoctorSlotsModel.findOne({
    doctorId,
    slotDate,
    startTime,
    endTime
  });
  if (existingSlot) {
    throw new ApiError(400, "This slot is already booked");
  }

  // 6. Book the slot in MongoDB
  const slot = new DoctorSlotsModel({
    doctorId,
    slotDate,
    startTime,
    endTime,
    bookedBy: patientId
  });
  const bookedSlot = await slot.save();

  if (!bookedSlot) throw new ApiError(500, "Failed to book slot");

  // 7. Enrich response with doctor & patient details
  const responseData = {
    ...bookedSlot._doc,
    doctor:{ 
        ...doctorResult,
        specialization : doctorData.specialization
    },
    patient: patientResult
  };

  return res
    .status(201)
    .json(new ApiResponse(201, responseData, "Slot booked successfully"));
});



// 📌 Cancel a booked slot
export const cancelSlot = asyncHandler(async (req, res) => {
  const { doctorId, slotDate, startTime, patientId } = req.body;

  if (!doctorId || !slotDate || !startTime || !patientId) {
    throw new ApiError(400, "All fields are required");
  }

  // 1. Check doctor exists
  const doctorResult = await pool.query(
    `SELECT doctor_id, user_id, specialization FROM doctors WHERE doctor_id = $1`,
    [doctorId]
  );
  if (doctorResult.rows.length === 0) {
    throw new ApiError(404, "Doctor not found");
  }

  // 2. Check patient exists
  const patientResult = await pool.query(
    `SELECT patient_id, user_id FROM patients WHERE patient_id = $1`,
    [patientId]
  );
  if (patientResult.rows.length === 0) {
    throw new ApiError(404, "Patient not found");
  }

  const doctorData = await getUserInformation(doctorResult.rows[0].user_id);
  const patientData = await getUserInformation(patientResult.rows[0].user_id);

  // 3. Find and delete the slot
  const slot = await DoctorSlotsModel.findOneAndDelete({
    doctorId,
    slotDate,
    startTime,
    bookedBy: patientId
  });

  if (!slot) {
    throw new ApiError(404, "No such booking found");
  }

  // 4. Enrich response
  const responseData = {
    ...slot._doc,
    doctor: {
        ...doctorData,
        specialization : doctorResult.specialization
    },
    patient: patientData
  };

  return res
    .status(200)
    .json(new ApiResponse(200, responseData, "Booking cancelled successfully"));
});




// 📌 Get all booked slot
// 📌 Get all booked slots (with doctor & patient info if needed)
export const getAllBookedSlot = asyncHandler(async (req, res) => {
  // 1. Get all booked slots from Mongo
  const slots = await DoctorSlotsModel.find({}).sort({ slotDate: 1, startTime: 1 });

  if (!slots || slots.length === 0) {
    throw new ApiError(404, "No booked slots found");
  }

  // 2. Enrich with doctor & patient info from PostgreSQL
  const enrichedSlots = await Promise.all(
    slots.map(async (slot) => {
      // Get doctor info
      const doctorResultDoctor = await pool.query(
        `SELECT doctor_id, user_id, specialization FROM doctors WHERE doctor_id = $1`,
        [slot.doctorId]
      );
      const doctorData = doctorResultDoctor.rows[0] || null;

      // Get patient info
      let patientData = null;
      if (slot.bookedBy) {
        const patientResultPatient = await pool.query(
          `SELECT patient_id, user_id FROM patients WHERE patient_id = $1`,
          [slot.bookedBy]
        );
        patientData = patientResultPatient.rows[0] || null;
      }
      const doctorResult = await getUserInformation(doctorData.user_id);

      const patientResult = await getUserInformation(patientData.user_id);

      return {
        ...slot._doc, // mongo slot data
        doctor : {
            ...doctorResult,
            specialization : doctorData.specialization
        },
        patient : patientResult,
      };
    })
  );

  return res
    .status(200)
    .json(new ApiResponse(200, enrichedSlots, "All booked slots fetched successfully"));
});
