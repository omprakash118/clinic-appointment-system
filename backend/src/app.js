import express from "express";
import { createServer } from 'http';
import { Server } from "socket.io";
import pkg from 'cookie-parser'; 
import cors from 'cors';

const { cookieParser } = pkg();

// Create an Express application
const app = express();

app.use(cors());

// ✅ Parse JSON bodies
app.use(express.json());

// ✅ Parse URL-encoded bodies (form submissions)
app.use(express.urlencoded({ extended : true }));

app.use(pkg());


// Create an HTTP server using the Express app
const server = createServer(app);

// Attach Socket.IO to the HTTP server
const io = new Server(server);


io.on("connection", (socket) => {
    console.log('✅ Client Connected :' , socket.id);
    
    socket.on("disconnected", () => {
        console.log('❌ Client disconnected :' , socket.id);
    })
})



// module.exports = { server };

export default server;