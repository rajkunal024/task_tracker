const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");
const ApiError = require("../utils/ApiError");
const { assertAdminKey } = require("../utils/adminEligibility");

const assertAdminKeyForPromotion = ({ role, adminKey, currentRole = "member" }) => {
  if (role === "admin" && currentRole !== "admin") {
    assertAdminKey(adminKey);
  }
};

const getUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ users: users.map((user) => user.toSafeObject()) });
};

const createUser = async (req, res) => {
  const { name, email, password, role = "member", adminKey } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required.");
  }

  if (!["admin", "member"].includes(role)) {
    throw new ApiError(400, "Role must be admin or member.");
  }

  assertAdminKeyForPromotion({ role, adminKey });

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(409, "A user with this email already exists.");
  }

  const user = await User.create({
    name,
    email,
    password,
    role
  });

  res.status(201).json({ message: "User created successfully.", user: user.toSafeObject() });
};

const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  res.json({ user: user.toSafeObject() });
};

const updateUserRole = async (req, res) => {
  const { role, adminKey } = req.body;

  if (!["admin", "member"].includes(role)) {
    throw new ApiError(400, "Role must be admin or member.");
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  assertAdminKeyForPromotion({ role, adminKey, currentRole: user.role });

  user.role = role;
  await user.save();

  res.json({ message: "User role updated.", user: user.toSafeObject() });
};

const updateUser = async (req, res) => {
  const { name, email, password, role, adminKey } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (role !== undefined && !["admin", "member"].includes(role)) {
    throw new ApiError(400, "Role must be admin or member.");
  }

  assertAdminKeyForPromotion({ role, adminKey, currentRole: user.role });

  if (email !== undefined && email.toLowerCase() !== user.email) {
    const existingUser = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
    if (existingUser) {
      throw new ApiError(409, "A user with this email already exists.");
    }
    user.email = email;
  }

  if (name !== undefined) {
    user.name = name;
  }

  if (password !== undefined && password.trim()) {
    user.password = password;
  }

  if (role !== undefined) {
    user.role = role;
  }

  await user.save();

  res.json({ message: "User updated successfully.", user: user.toSafeObject() });
};

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  await Project.updateMany({ members: user._id }, { $pull: { members: user._id } });
  await Task.deleteMany({ assignedTo: user._id });
  await user.deleteOne();

  res.json({ message: "User deleted successfully." });
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  updateUserRole,
  deleteUser
};
