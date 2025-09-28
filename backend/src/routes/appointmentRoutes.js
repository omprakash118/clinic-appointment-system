import { Router } from "express";
import {
    scheduleAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointmen,
    cancelAppointment
} from "../controllers/appointmentController.js";

const router = Router();

router.route('/').post(scheduleAppointment);
router.route('/').get(getAppointments);
router.route('/:id').get(getAppointmentById);
router.route('/:id').patch(updateAppointmen);
router.route('/:id').delete(cancelAppointment);

export default router;
