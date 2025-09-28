import express from "express";
import { createServer } from 'http';
import { Server } from "socket.io";
import pkg from 'cookie-parser'; 
import cors from 'cors';
import { createDoctorTable } from "./models/PostgreSQL/DoctorModels.js";
import { createPatientTable } from "./models/PostgreSQL/UserModels.js";
import { createAppointmentTable } from "./models/PostgreSQL/AppointmentModels.js";


// Create an Express application
const app = express();

app.use(cors());

// ✅ Parse JSON bodies
app.use(express.json());

// ✅ Parse URL-encoded bodies (form submissions)
app.use(express.urlencoded({ extended : true }));

app.use(pkg());

// Import all Routers...
import doctorRouter from "./routes/doctorRoutes.js";
import patientRouter from './routes/patientRoutes.js';
import appointmentRouter from './routes/appointmentRoutes.js';

// USE All Routers..
app.use('/api/doctor', doctorRouter);
app.use('/api/patient', patientRouter);
app.use('/api/appointment', appointmentRouter);


// Create an HTTP server using the Express app
const server = createServer(app);

// Attach Socket.IO to the HTTP server
const io = new Server(server);


io.on("connection", (socket) => {
    console.log('✅ Client Connected :' , socket.id);
    
    socket.on("disconnected", () => {
        console.log('❌ Client disconnected :' , socket.id);
    })
});

(async () => {
    await createDoctorTable();
    await createPatientTable();
    await createAppointmentTable();
})();




// module.exports = { server };

export default server;