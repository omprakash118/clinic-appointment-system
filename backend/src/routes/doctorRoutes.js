import Router from 'express';
import { 
    createDoctor,
    getDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
    promoteUserToDoctor
} from "../controllers/doctorController.js";

const router = Router();

router.route('/createDoctor').post(createDoctor);
router.route('/promote').post(promoteUserToDoctor);
router.route('/').get(getDoctors);
router.route('/:id').get(getDoctorById);
router.route('/updateDoctor/:id').patch(updateDoctor);
router.route('/deleteDoctor/:id').delete(deleteDoctor);



export default router;