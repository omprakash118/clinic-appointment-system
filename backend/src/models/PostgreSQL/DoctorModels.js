import { pool } from "../../config/postgreSQL.js";


// Check Email
export const findUserByEmail = async (email) => {
  const query = `
    SELECT * FROM users 
    WHERE email = $1 
    LIMIT 1;
  `;
  const result = await pool.query(query, [email]);
  return result.rows[0]; // will be undefined if no match
};


// ✅ Insert Doctor along with User
export const insertDoctor = async ({ name,  phone, email , hashedPassword, gender, date_of_birth, specialization, role = "doctor",license_number, qualification, experience_years, consultation_fee, availability}) => {
  
  console.log("name :- ", name);


  // Step 1: Insert into users table
  const userQuery = `
    INSERT INTO users (name, phone, email, password , gender, date_of_birth , role)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
  `;
  const userValues = [name,  phone, email, hashedPassword, gender, date_of_birth, role];
  const userResult = await pool.query(userQuery, userValues);
  const userId = userResult.rows[0].id;

  // Step 2 : Insert into doctors table
  const doctorQuery = `
    INSERT INTO doctors(user_id, specialization,license_number, qualification, experience_years, consultation_fee, availability)
    VALUES($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const doctorResult = await pool.query(doctorQuery, [userId, specialization,license_number, qualification, experience_years, consultation_fee, availability]);
  return { ...userResult.rows[0] , ...doctorResult.rows[0] };
};

// ✅ Get All Doctors
export const fetchDoctors = async () => {
  const query = `
    SELECT d.doctor_id, d.user_id, u.name, u.email, u.phone, u.gender, u.date_of_birth , d.specialization, d.license_number, d.qualification, d.experience_years, d.consultation_fee, d.availability, u.created_at, u.updated_at, d.created_at, d.updated_at 
    FROM doctors d
    JOIN users u ON d.user_id = u.id
    ORDER BY d.doctor_id ASC;
  `;
  const result = await pool.query(query);
  return result.rows;
};

// ✅ Get Doctor By ID
export const fetchDoctorById = async (id) => {
  const query = `
        SELECT d.doctor_id, d.user_id, u.name, u.email, u.phone, u.gender, u.date_of_birth , d.specialization, d.license_number, d.qualification, d.experience_years, d.consultation_fee, d.availability, u.created_at, u.updated_at, d.created_at, d.updated_at 
        FROM doctors d
        JOIN users u ON d.user_id = u.id
        WHERE d.doctor_id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

// ✅ Update Doctor
export const updateDoctorById = async (doctorId, updatedData) => {

  // 1. Get user_id from doctor_id
  const res = await pool.query("SELECT user_id FROM doctors WHERE doctor_id = $1", [doctorId]);
  if(!res.rows[0]) return null;
  const userId = res.rows[0].user_id;

  // 2. Update users table
  const userColumns = [];
  const userValues = [];
  let idx = 1;
  for(const [key, value] of Object.entries(updatedData)){
    if (['name', 'email', 'phone', 'gender', 'password', 'date_of_birth' , "role"].includes(key) && value !== undefined) {
      userColumns.push(`${key} = $${idx}`);
      userValues.push(value);
      idx++;
    }
  }
  if(userColumns.length > 0){
    userValues.push(userId);
     await pool.query(`UPDATE users SET ${userColumns.join(", ")}, updated_at = NOW() WHERE id = $${idx}`, userValues);
  }

   // 3. Update doctors table
    const doctorColumns = [];
    const doctorValues = [];
    for (const [key, value] of Object.entries(updatedData)) {
        if (['specialization', 'license_number', 'qualification', 'experience_years', 'consultation_fee', 'availability'].includes(key) && value !== undefined) {
            doctorColumns.push(`${key} = $${doctorValues.length + 1}`);
            doctorValues.push(value);
        }
    }
    if (doctorColumns.length > 0) {
        doctorValues.push(doctorId);
        const query = `UPDATE doctors SET ${doctorColumns.join(", ")}, updated_at = NOW() WHERE doctor_id = $${doctorValues.length} RETURNING *;`;
        const result = await pool.query(query, doctorValues);
        return result.rows[0];
    }
  // const values = [name, specialization, phone, email, id];
  // const result = await pool.query(query, values);
    return fetchDoctorById(doctorId);
};

// ✅ Delete doctor (also deletes user via CASCADE)
export const deleteDoctorById = async (doctorId) => {
    const result = await pool.query("DELETE FROM doctors WHERE doctor_id = $1 RETURNING *;", [doctorId]);
    return result.rows[0];
};