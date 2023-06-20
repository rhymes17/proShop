import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// @desc Login a new user
// @route "/api/users/login"
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  //Validate data
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(500);
    throw new Error("Please include all fields");
  }

  //Check if user exists
  const user = await User.findOne({ email });
  // res.json(user);

  if (user) {
    const corrPass = await bcrypt.compare(password, user.password);

    if (!corrPass) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("No user found! Try signing in first");
  }
});

// @desc Register a new User
// @route "/api/user/register"
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  //Validate data
  const { name, email, password, isAdmin } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please include all fields");
  }

  //Check if the user exists
  const existsUser = await User.findOne({ email });
  if (existsUser) {
    res.status(400);
    throw new Error("User already exists! Try logging in");
  }

  //Generate salt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    isAdmin,
    password: hashedPassword,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc LogOut and clear cookie
// @route POST "api/users/logout"
// @access Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

// @desc   Get user profile
// @route  GET "/api/users/profile"
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

// @desc   Get user profile
// @route  PUT "/api/users/profile"
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const updatedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = updatedPassword;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      Id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

// @desc   Get all users
// @route  GET "/api/users"
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});

  res.status(200).json(users);
});

// @desc   Get user by ID
// @route  GET "/api/users/:id"
// @access Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc   Delete user
// @route DELETE "/api/users/:id"
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin === true) {
      res.status(400);
      throw new Error("Cannot delete an admin");
    }
    await User.deleteOne({ _id: user._id });

    res.status(200).json("Deleted User successfuly");
  } else {
    res.status(404);
    throw new Error("User not Found");
  }
});

// @desc   Update user
// @route PUT "/api/users/:id"
// @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  const { name, email, isAdmin } = req.body;

  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    user.isAdmin = Boolean(isAdmin);

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found!");
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUserProfile,
};
