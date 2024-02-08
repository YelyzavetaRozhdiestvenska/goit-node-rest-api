import { Router } from "express";
import {
  register,
  login,
  logout,
  getCurrent,
  subscriprion,
  updateAvatar,
} from "../controllers/userControllers.js";
import validateBody from "../helpers/validateBody.js";
import { registerSchema, loginSchema, subscriprionSchema } from "../models/userModel.js";
import { authenticate } from "../helpers/authenticate.js";
import { upload } from "../helpers/upload.js";

const userRouter = Router();

// signup
userRouter.post("/register", validateBody(registerSchema), register);

// signin
userRouter.post("/login", validateBody(loginSchema), login);

userRouter.post("/logout", authenticate, logout);

userRouter.get("/current", authenticate, getCurrent);

userRouter.patch("/", authenticate, validateBody(subscriprionSchema), subscriprion);

userRouter.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

export default userRouter;
