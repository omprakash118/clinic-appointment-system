import {
    createUsers,
    getUserById,
    getUsers,
    updateUser,
    deleteUsers
} from "../controllers/userController.js";

import { Router } from "express";

const router = Router();

router.route('/').get(getUsers);
router.route('/').post(createUsers);
router.route('/:id').get(getUserById);
router.route('/:id').patch(updateUser);
router.route('/:id').delete(deleteUsers);

export default router;