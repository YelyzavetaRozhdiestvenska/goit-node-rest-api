import { Router } from "express";
import { register, login, logout, getCurrent } from "../controllers/userControllers.js";
import validateBody from "../helpers/validateBody.js";
import { registerSchema, loginSchema } from "../models/userModel.js";
import { authenticate } from "../helpers/authenticate.js";

const userRouter = Router();

// signup
userRouter.post("/register", validateBody(registerSchema), register);

// signin
userRouter.post("/login", validateBody(loginSchema), login);

userRouter.post("/logout", authenticate, logout);

userRouter.get("/current", authenticate, getCurrent);

export default userRouter;
