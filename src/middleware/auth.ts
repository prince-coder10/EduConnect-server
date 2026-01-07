import type { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { verifyAccessToken } from "../utils/jwt.js";

export interface AuthRequest extends Request {
  user?: { userId: string };
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing authorization header" });
    }
    const token = authHeader.split(" ")[1] as string;
    const payload = verifyAccessToken(token);

    const user = await User.findById(payload.userId);
    if (!user || user.tokenVersion !== payload.tokenVersion) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
