import { pool } from "../../config/postgreSQL.js";

// ✅ create Appointment Table
export const createAppointmentTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS appointments (
            appointment_id SERIAL PRIMARY KEY,
            doctor_id INT NOT NULL REFERENCES doctors(doctor_id) ON DELETE CASCADE,
            patient_id INT NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
            appointment_date TIMESTAMP NOT NULL,
            status VARCHAR(20) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT NOW()
        );
    `;

    await pool.query(query);
    console.log("✅ Appointments Table is ready");
};


// ✅ Create Appointment
export const insertAppointment = async ({doctor_id, patient_id, appointment_date,status}) => {
    const query = `
        INSERT INTO appointments (doctor_id,patient_id,appointment_date,status)
        VALUES ($1, $2 , $3, $4) RETURNING *;
    `;
    const values = [doctor_id,patient_id,appointment_date,status || "pending"];
    const result = await pool.query(query, values);
    return result.rows[0];
}


// ✅ Get all appointments
export const fetchAppointments = async () => {
    const query = `
        SELECT a.appointment_id, a.appointment_date, a.status,
               d.name AS doctor_name, d.specialization,
               p.name AS patient_name, p.email AS patient_email
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.doctor_id
        JOIN patients p ON a.patient_id = p.patient_id
        ORDER BY a.appointment_date ASC;
    `;
    const result = await pool.query(query);
    return result.rows;
};


// ✅ Get Appointment by ID
export const fetchAppointmentsById = async (id) => {
    const query = `
        SELECT a.appointment_id, a.appointment_date, a.status,
               d.name AS doctor_name, d.specialization,
               p.name AS patient_name, p.email AS patient_email
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.doctor_id
        JOIN patients p ON a.patient_id = p.patient_id
        WHERE a.appointment_id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};


// ✅ Update Appointment (date or Status)
export const updateAppointmentById = async ( id , updatedData) => {

    const values = [];
    const columns = [];

    let idx = 1;

    for(const [key, value] of Object.entries(updatedData)){
        if(value !== undefined){
            columns.push(`${key} = $${idx}`);
            values.push(value);
            idx++;
        }
    }
    
    
    if(columns.length === 0) return null;

    values.push(id);

    const query = `
        UPDATE appointments
        SET ${columns.join(', ')}
        WHERE appointment_id = $${idx} 
        RETURNING *;
    `;
    // const values = [appointment_date, status, id];
    const result = await pool.query(query, values);
    return result.rows[0];
};


// ✅ Delete Appointment
export const deleteAppointmentById = async (id) => {
    const query = `
        DELETE FROM appointments WHERE appointment_id = $1 RETURNING *;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
}