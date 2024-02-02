import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import HttpError from "../helpers/HttpError.js";
import { User } from "../models/userModel.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const SECRET_KEY = process.env;

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    user: { email: newUser.email, name: newUser.name },
  });
};
export const register = ctrlWrapper(registerUser);

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token,
    user: { email, subscription },
  });
};

export const login = ctrlWrapper(loginUser);

const logoutUser = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({
    message: "Logout request",
  });
};

export const logout = ctrlWrapper(logoutUser);

const getCurrentUser = async (req, res) => {
  const { email } = req.user;

  res.status(200).json({
    email,
    subscription,
  });
};
export const getCurrent = ctrlWrapper(getCurrentUser);
