import { pool } from '../../config/postgreSQL.js';


// User table
export const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE,
        phone VARCHAR(20)  NOT NULL,
        password TEXT NOT NULL,
        gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
        date_of_birth DATE,
        role VARCHAR(20) CHECK (role IN ('doctor', 'patient', 'admin')), -- 'doctor' | 'patient' | 'admin'
        refresh_token TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
  console.log("✅ User table is ready");
};


// Doctor table
export const createDoctorTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS doctors (
        doctor_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        specialization VARCHAR(100) NOT NULL,
        license_number VARCHAR(50) UNIQUE,
        qualification VARCHAR(100),
        experience_years INT CHECK (experience_years >= 0),
        consultation_fee NUMERIC(10,2),
        availability JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
  console.log("✅ Doctors table is ready");
};


// Patient table
export const createPatientTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS patients (
      patient_id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      blood_group VARCHAR(5),
      allergies TEXT,
      existing_conditions TEXT,
      current_medications TEXT,
      emergency_contact VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
  console.log("✅ Patient table is ready");
};



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


// ✅ Insert User 
export const insertUser = async ({name, phone, email, gender, hashedPassword, role, date_of_birth}) => {
    const query = `
        INSERT INTO users(name , phone , email, password , gender , role, date_of_birth)
        VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;
    const values = [name, phone, email, hashedPassword, gender, role, date_of_birth];
    const result = await pool.query(query, values);
    return result.rows[0];
}

// ✅ Fetch All Users
export const fetchUsers = async () => {
    const query = `
        SELECT id, name, phone, email, gender, role, date_of_birth, created_at, updated_at
        FROM users
        ORDER BY id ASC;
    `;
    const result = await pool.query(query);
    return result.rows;
};

// ✅ Fetch User By ID
export const fetchUserById = async (id) => {
    const query = `
        SELECT id, name, phone, email, gender, role, date_of_birth, created_at, updated_at
        FROM users
        WHERE id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

// ✅ Update User By ID (dynamic / partial update)
export const updateUserById = async (id, updatedData) => {
    const columns = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(updatedData)) {
        if (['name', 'phone', 'email', 'gender', 'password', 'refresh_token', 'date_of_birth'].includes(key) && value !== undefined) {
            columns.push(`${key} = $${idx}`);
            values.push(value);
            idx++;
        }
    }

    if (columns.length === 0) return null;

    values.push(id);

    const query = `
        UPDATE users
        SET ${columns.join(", ")}, updated_at = NOW()
        WHERE id = $${idx}
        RETURNING *;
    `;
    const result = await pool.query(query, values);
    return result.rows[0];
};

// ✅ Delete Users
export const deleteUserById = async(userId) => {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *;', [userId]);
    return result.rows[0];
}