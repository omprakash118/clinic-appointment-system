import {
    createPatients,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient
} from '../controllers/patientController.js';


import { Router } from 'express';

const router = Router();

router.route('/').get(getPatients);
router.route('/createPatients').post(createPatients);
router.route('/:id').get(getPatientById);
router.route('/updatePatient/:id').patch(updatePatient);
router.route('/deletePatient/:id').delete(deletePatient);

export default router;