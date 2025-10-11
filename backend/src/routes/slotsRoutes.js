import Router from 'express';
import {
    getBookedSlots,
    getAllBookedSlot,
    bookSlot,
    deleteSlots,
    confirmSlot,
    cancelSlot,
    updateSlots
} from '../controllers/slotController.js';


const router = Router();

router.route('/booked').get(getBookedSlots);
router.route('/allSlots').get(getAllBookedSlot);
router.route('/book').post(bookSlot);
router.route('/delete').delete(deleteSlots);
router.route('/confirm').post(confirmSlot);
router.route('/cancel').post(cancelSlot);
router.route('/update').patch(updateSlots);
 
export default router;