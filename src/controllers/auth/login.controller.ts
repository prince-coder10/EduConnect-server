import type { Request, Response } from "express";
import UserService from "../../services/user.service.js";
import UserStore from "../../store/user.store.js";
import { catchError } from "../../utils/catchError.js";

const User = new UserService(new UserStore());
const COOKIE_NAME = process.env.COOKIE_NAME || "jid";
export const loginUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const { user, accessToken } = await User.loginUser(email, password);

    if (!user || !user.refreshToken || !accessToken)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.cookie(COOKIE_NAME, user.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/api/auth/refresh",
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: User.toSafeUser(user),
      accessToken,
    });
  } catch (error) {
    console.log("Error logging in user:", error);
    return catchError(res, error);
  }
};
