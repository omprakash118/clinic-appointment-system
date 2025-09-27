import dotenv from 'dotenv';
import server  from './app.js';
import {connectPostDB} from './config/postgreSQL.js';
import connectMongoDB from './config/mongo.js';

// Load environment variables from .env file
dotenv.config({
    path : './.env'
});

const PORT = process.env.PORT;


// Start the server and listen on the specified port

console.log("PORT :_ ", PORT);

Promise.all([connectPostDB() , connectMongoDB()])
    .then(() => {
        server.listen(PORT, () => {
            console.log("⚙️ Server started st PORT :-", PORT);
        })
    })
    .catch((error) => {
        console.error('❌ Error starting server:', error);
        process.exit(1);
    });

