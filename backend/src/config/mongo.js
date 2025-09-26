import mongoose from 'mongoose';

const connectMongoDB = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        console.log("✅ MongoDB Atlas connected successfully");
    } catch (error) {
        console.error('❌ MongoDB Connection Failed - ', error) 
        process.exit(1); // Exit process with failure
    }
}

// module.exports = { connectMongoDB};

export default connectMongoDB;