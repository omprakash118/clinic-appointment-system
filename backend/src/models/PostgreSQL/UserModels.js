import { pool } from '../../config/postgreSQL.js';


// ✅ Create Patient table if not exists
export const createPatientTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS patients (
            patient_id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            age INT NOT NULL,
            gender VARCHAR(10),
            phone VARCHAR(20) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            access_token TEXT,
            refresh_token TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        );
    `;
    await pool.query(query);
    console.log("✅ Patients table is ready");
};


// ✅ Insert Patient
export const insertPatient = async ({name , age, gender,phone,email,hashedPassword}) => {
    const query = `
        INSERT INTO patients(name,age,gender,phone,email,password)
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    const values = [name, age, gender, phone, email, hashedPassword];
    const result = await pool.query(query, values);
    return result.rows[0];
}




// ✅ Get All Patients
export const fetchPatient = async () => {
    const query = `
        SELECT patient_id,name,age,gender,phone,email,created_at
        FROM patients
        ORDER BY patient_id ASC;
    `;
    const result = await pool.query(query);
    return result.rows;
}


// ✅ Get Patients BY ID
export const fetchPatientById = async (id) => {
    const query = `
        SELECT id,name,age,gender,phone,email,created_at
        FROM patients
        WHERE patient_id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

// ✅ Update Patient By ID (dynamic / partial update)
export const updatePatientById = async (id, updatedData) => {
    const columns = [];
    const values = [];
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
        UPDATE patients
        SET ${columns.join(", ")}
        WHERE patient_id = $${idx}
        RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
};


// ✅ Delete Patient By ID
export const deletePatientById = async (id) => {
  const result = await pool.query("DELETE FROM patients WHERE patient_id = $1 RETURNING *;", [id]);
  return result.rows[0];
};