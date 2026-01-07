import type { Request, Response } from "express";
import AuthService from "../../services/auth.service.js";
import UserStore from "../../store/user.store.js";
import { catchError } from "../../utils/catchError.js";

const Auth = new AuthService(new UserStore());
const COOKIE_NAME = process.env.COOKIE_NAME || "jid";

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const token = req.cookies[COOKIE_NAME] as string;

    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });

    const { accessToken, newRefreshToken } = await Auth.refreshTokens(token);

    // set cookie
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie(COOKIE_NAME, newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 14 * 24 * 60 * 60 * 1000,
      path: "/api/auth/refresh",
    });

    return res.json({ accessToken });
  } catch (error) {
    console.log("Error refreshing token:", error);
    return catchError(res, error);
  }
};
