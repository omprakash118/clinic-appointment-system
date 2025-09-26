import express from "express";
import { createServer } from 'http';
import { Server } from "socket.io";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();



//  Get the port number from environment variables
const PORT = process.env.PORT;

// Create an Express application
const app = express();

// Create an HTTP server using the Express app
const server = createServer(app);

// Attach Socket.IO to the HTTP server
const io = new Server(server);



io.on('connection' , (socket) => {
    console.log("a user connected");
})


// Start the server and listen on the specified port
server.listen(PORT, () => {
    console.log("⚙️ Server started st PORT :-", PORT);
})
