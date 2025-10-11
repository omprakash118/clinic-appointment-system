import mongoose from 'mongoose';

const doctorSlotSchema = new mongoose.Schema({
    doctorId : {
        type : Number,
        require : true
    },
    slotDate : {
        type : String,
        require : true
    },
    startTime: {
        type: String, // "09:30"
        required: true
    },
    endTime: {
        type: String, // "10:00"
        required: true
    },
    status : {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        required: [true, 'Status is required'],
        default : 'pending'
    },
    bookedBy: {
        type: Number, // <-- PostgreSQL patient.id
        default: null
    }
}, { timestamps: true });


doctorSlotSchema.index({ doctorId : 1, slotDate : 1, startTime: 1}, {unique : true});

export default mongoose.model("DoctorSlot", doctorSlotSchema);