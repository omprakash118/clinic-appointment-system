import {
    getDashboardStats,
    getSystemOverview
}   from "../controllers/adminController.js";

import { Router } from "express";

const router = Router();


router.route('/dashboardStats').get(getDashboardStats);
router.route('/dashboardOverview').get(getSystemOverview);

export default router;