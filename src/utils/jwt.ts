import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET as string;
const ACCESS_EXPIRY = +process.env.ACCESS_TOKEN_EXPIRES_IN!;
const REFRESH_EXPIRY = +process.env.REFRESH_TOKEN_EXPIRES_IN!;

interface AccessPayload {
  userId: string;
  tokenVersion: number;
}

interface RefreshPayload {
  userId: string;
  tokenVersion: number;
}

// ---- SIGN ----
export function signAccessToken(payload: AccessPayload) {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRY,
  });
}

export function signRefreshToken(payload: RefreshPayload) {
  const token = jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRY,
  });
  return token;
}

// ---- VERIFY ----
export function verifyAccessToken(token: string): AccessPayload {
  return jwt.verify(token, ACCESS_SECRET) as AccessPayload;
}

export function verifyRefreshToken(token: string): RefreshPayload {
  return jwt.verify(token, REFRESH_SECRET) as RefreshPayload;
}
