import type { Request, Response } from "express";
import UserService from "../../services/user.service.js";
import UserStore from "../../store/user.store.js";
import { verifyRefreshToken } from "../../utils/jwt.js";
import { catchError } from "../../utils/catchError.js";

const User = new UserService(new UserStore());
const COOKIE_NAME = process.env.COOKIE_NAME || "jid";
export const logout = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const token = req.cookies[COOKIE_NAME] as string;
    if (token) {
      try {
        const payload = verifyRefreshToken(token);
        if (payload) {
          await User.logoutUser(payload.userId);
        }
      } catch (error) {}

      res.clearCookie(COOKIE_NAME, {
        path: "/api/auth/refresh",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return catchError(res, error);
  }
};
