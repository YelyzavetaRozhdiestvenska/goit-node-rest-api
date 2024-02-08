import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import path from "path";
import { promises as fs } from "fs";
import HttpError from "../helpers/HttpError.js";
import { User } from "../models/userModel.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import Jimp from "jimp";

const { SECRET_KEY } = process.env;

const avatarsDir = path.resolve("public/avatars");

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email);

  const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });

  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
  });
};
export const register = ctrlWrapper(registerUser);

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).exec();

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
    user: { email: user.email, subscription: user.subscription },
  });
};

export const login = ctrlWrapper(loginUser);

const logoutUser = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });

  res.status(204).send();
};

export const logout = ctrlWrapper(logoutUser);

const getCurrentUser = async (req, res) => {
  const { email, subscription } = req.user;

  res.status(200).json({
    email,
    subscription,
  });
};
export const getCurrent = ctrlWrapper(getCurrentUser);

const updateSubscription = async (req, res, next) => {
  const { _id: user } = req.user;

  const userSubscription = await User.findByIdAndUpdate(user, req.body, {
    new: true,
  });

  if (!userSubscription) return next();

  const { email, subscription } = userSubscription;

  res.status(200).json({
    email,
    subscription,
  });
};
export const subscriprion = ctrlWrapper(updateSubscription);

const updateUserAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  async function resize() {
    const image = await Jimp.read(tempUpload);
    image
      .resize(250, 250, function (err) {
        if (err) throw err;
      })
      .write(tempUpload);

    await fs.rename(tempUpload, resultUpload);
  }

  resize();

  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

export const updateAvatar = ctrlWrapper(updateUserAvatar);
