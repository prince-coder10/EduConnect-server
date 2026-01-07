import { Router } from "express";
import { registerUser } from "../controllers/auth/register.controller.js";
import { loginUser } from "../controllers/auth/login.controller.js";
import { refreshToken } from "../controllers/auth/refresh.controller.js";

const authRoute = Router();

authRoute.post("/api/auth", registerUser);
authRoute.post("/api/auth/user", loginUser);
authRoute.post("/api/auth/refresh", refreshToken);

export default authRoute;
