import { pool } from "../../config/postgreSQL.js";

// ✅ Create Doctor table if not exists
export const createDoctorTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS doctors (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      specialization VARCHAR(100) NOT NULL,
      phone VARCHAR(20) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL, 
      access_token TEXT,
      refresh_token TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(query);
  console.log("✅ Doctors table is ready");
};

// ✅ Insert Doctor
export const insertDoctor = async ({ name, specialization, phone, email , hashedPassword}) => {
  const query = `
    INSERT INTO doctors (name, specialization, phone, email, password)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;
  `;
  const values = [name, specialization, phone, email, hashedPassword];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// ✅ Get All Doctors
export const fetchDoctors = async () => {
  const result = await pool.query("SELECT id, name, specialization, phone, email, created_at FROM doctors ORDER BY id ASC;");
  return result.rows;
};

// ✅ Get Doctor By ID
export const fetchDoctorById = async (id) => {
  const result = await pool.query("SELECT id, name, specialization, phone, email, created_at FROM doctors WHERE id = $1;", [id]);
  return result.rows[0];
};

// ✅ Update Doctor
export const updateDoctorById = async (id, updatedData) => {

  const columns = [];
  const values = [];

  let idx = 1;
  for(const [key,value] of Object.entries(updatedData)){
    if(value !== undefined){
      columns.push(`${key} = $${idx}`);
      values.push(value);
      idx++;
    }
  }

  if(columns.length === 0) return null;

  values.push(id);
  
  const query = `
    UPDATE doctors
    SET ${columns.join(", ")}
    WHERE id = $${idx}
    RETURNING *;
  `;
  // const values = [name, specialization, phone, email, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// ✅ Delete Doctor
export const deleteDoctorById = async (id) => {
  const result = await pool.query("DELETE FROM doctors WHERE id = $1 RETURNING *;", [id]);
  return result.rows[0];
};