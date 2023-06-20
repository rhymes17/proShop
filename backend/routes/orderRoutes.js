import express from "express";
import { adminProtect, protect } from "../middleware/protect.js";
import {
  addOrderItems,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderToDelivered,
  updateOrderToPaid,
} from "../controllers/orderController.js";
const router = express.Router();

router
  .route("/")
  .post(protect, addOrderItems)
  .get(protect, adminProtect, getAllOrders);
router.get("/myorders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/pay", protect, updateOrderToPaid);
router.put("/:id/deliver", protect, adminProtect, updateOrderToDelivered);

export default router;
