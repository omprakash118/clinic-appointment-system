import Router from 'express';
import {
    getBookedSlots,
    getAllBookedSlot,
    bookSlot,
    cancelSlot
} from '../controllers/slotController.js';


const router = Router();

router.route('/booked').get(getBookedSlots);
router.route('/allSlots').get(getAllBookedSlot);
router.route('/book').post(bookSlot);
router.route('/cancel').delete(cancelSlot);

export default router;