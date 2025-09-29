import { pool } from '../../config/postgreSQL.js';



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

// ✅ Insert Patient along with user
export const insertPatient = async ({ name, phone, email, gender, hashedPassword, role = 'patient', date_of_birth, blood_group, allergies, existing_conditions, current_medications, emergency_contact }) => {
    // 1. Insert into users table
    const userQuery = `
        INSERT INTO users(name, phone, email, password, gender, date_of_birth, role)
        VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;
    const userResult = await pool.query(userQuery, [name, phone, email, hashedPassword, gender, date_of_birth, role]);
    const userId = userResult.rows[0].id;

    // 2. Insert into patients table
    const patientQuery = `
        INSERT INTO patients(user_id, blood_group, allergies, existing_conditions, current_medications, emergency_contact)
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    const patientResult = await pool.query(patientQuery, [userId, blood_group, allergies, existing_conditions, current_medications, emergency_contact]);
    return { ...userResult.rows[0] , ...patientResult.rows[0] };
};


// ✅ Fetch all patients
export const fetchPatients = async () => {
    const query = `
        SELECT p.patient_id, p.user_id, u.name, u.email, u.phone, u.gender, u.date_of_birth,  p.blood_group, p.allergies, p.existing_conditions, p.current_medications, p.emergency_contact, u.created_at, u.updated_at, p.created_at, p.updated_at
        FROM patients p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.patient_id ASC;
    `;
    const result = await pool.query(query);
    return result.rows;
};

// ✅ Fetch patient by ID
export const fetchPatientById = async (id) => {
    const query = `
        SELECT p.patient_id, p.user_id , u.name, u.email, u.phone, u.gender, u.date_of_birth,  p.blood_group, p.allergies, p.existing_conditions, p.current_medications, p.emergency_contact, u.created_at, u.updated_at, p.created_at, p.updated_at
        FROM patients p
        JOIN users u ON p.user_id = u.id
        WHERE p.patient_id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

// ✅ Update patient
export const updatePatientById = async (patientId, updatedData) => {
    // 1. Get user_id from patient_id
    const res = await pool.query("SELECT user_id FROM patients WHERE patient_id = $1", [patientId]);
    if (!res.rows[0]) return null;
    const userId = res.rows[0].user_id;

    // 2. Update users table
    const userColumns = [];
    const userValues = [];
    let idx = 1;
    for (const [key, value] of Object.entries(updatedData)) {
        if (['name', 'email', 'phone', 'gender', 'password', 'date_of_birth' , 'role'].includes(key) && value !== undefined) {
            userColumns.push(`${key} = $${idx}`);
            userValues.push(value);
            idx++;
        }
    }
    if (userColumns.length > 0) {
        userValues.push(userId);
        await pool.query(`UPDATE users SET ${userColumns.join(", ")}, updated_at = NOW() WHERE id = $${idx}`, userValues);
    }

    // 3. Update patient table
    const patientColumns = [];
    const patientValues = [];
    for (const [key, value] of Object.entries(updatedData)) {
        if (['blood_group', 'allergies', 'existing_conditions', 'current_medications', 'emergency_contact'].includes(key) && value !== undefined) {
            patientColumns.push(`${key} = $${patientValues.length + 1}`);
            patientValues.push(value);
        }
    }
    if (patientColumns.length > 0) {
        patientValues.push(patientId);
        const query = `UPDATE patients SET ${patientColumns.join(", ")}, updated_at = NOW() WHERE patient_id = $${patientValues.length} RETURNING *;`;
        const result = await pool.query(query, patientValues);
        return result.rows[0];
    }

    return fetchPatientById(patientId);
};

// ✅ Delete patient (also deletes user via CASCADE)
export const deletePatientById = async (patientId) => {
    const result = await pool.query("DELETE FROM patients WHERE patient_id = $1 RETURNING *;", [patientId]);
    return result.rows[0];
};