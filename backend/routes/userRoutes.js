import express from "express";
import {
  deleteUser,
  getUserById,
  getUserProfile,
  getUsers,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
  updateUserProfile,
} from "../controllers/userController.js";
import { adminProtect, protect } from "../middleware/protect.js";
const router = express.Router();

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/logout").post(logoutUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route("/").get(protect, adminProtect, getUsers);
router
  .route("/:id")
  .put(protect, adminProtect, updateUser)
  .get(protect, adminProtect, getUserById)
  .delete(protect, adminProtect, deleteUser);

export default router;
