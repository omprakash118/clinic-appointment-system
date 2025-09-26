# 🏥 Clinic Appointment System

A **full-stack MERN application** for managing appointments in a clinic, built with **React, Node.js, Express, PostgreSQL (Neon), and MongoDB (Atlas)**.  
This system allows **patients, doctors, and administrators** to interact efficiently, with **role-based access** and a modern user interface powered by **TailwindCSS**.

---

## 🔹 Features

### **Patient**
- Register and login securely  
- Browse doctors and book appointments  
- Reschedule or cancel appointments  
- View appointment history  

### **Doctor**
- Login and manage availability  
- View upcoming appointments  
- Add medical notes and prescriptions for patients  

### **Admin**
- Manage patients, doctors, and appointments  
- Monitor system activity and notifications  

### **Common Features**
- Role-based authentication using JWT  
- Real-time notifications (optional)  
- Responsive UI built with TailwindCSS  
- **Dual database setup:**  
  - **PostgreSQL (Neon):** Structured data (users, doctors, appointments)  
  - **MongoDB (Atlas):** Flexible data (medical history, prescriptions, notifications)  

---

## 🔹 Technologies Used
- **Frontend:** React.js, TailwindCSS  
- **Backend:** Node.js, Express.js  
- **Databases:** PostgreSQL (Neon), MongoDB (Atlas)  
- **Authentication:** JWT (JSON Web Tokens)  
- **API Calls:** Axios  

---

## 🔹 Project Structure


clinic-appointment-system/
│
├── backend/ # Node.js + Express API
│ ├── config/ # PostgreSQL + MongoDB connections
│ ├── models/ # SQL + MongoDB models
│ ├── routes/ # API routes
│ ├── controllers/ # Logic for routes
│ └── middlewares/ # Auth, role-based access, error handling
│
├── frontend/ # React.js frontend
│ ├── components/ # Reusable components (Navbar, Cards, etc.)
│ ├── pages/ # Patient, Doctor, Admin dashboards
│ ├── api/ # Axios API calls
│ ├── hooks/ # Custom React hooks
│ └── context/ # Auth context
│
└── .env # Environment variables for DB URIs and JWT secret

---

## 🔹 Future Enhancements

- Email/SMS reminders for appointments
- Real-time chat between doctor and patient
- Admin dashboard analytics with charts
- Payment integration for appointments

---

This version now correctly uses **PostgreSQL (Neon)** for your relational data.  

I can also **create a GitHub-ready version with badges for React, Node.js, PostgreSQL, MongoDB, TailwindCSS** to make it **look professional and attractive** for your portfolio.  

Do you want me to do that next?
