// src/utils/hash.ts
import argon2 from "argon2";
import crypto from "crypto";

export async function hashPassword(plain: string) {
  // recommended argon2id defaults, only tune if you know memory/CPU constraints
  return await argon2.hash(plain, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16, // 65536 KiB
    timeCost: 3,
    parallelism: 1,
  });
}

export async function verifyPassword(hash: string, plain: string) {
  return await argon2.verify(hash, plain);
}

// refresh tokens are long random strings. Store a SHA-256 hash in DB (fast, one-way).
export function hashRefreshToken(refreshToken: string) {
  return crypto.createHash("sha256").update(refreshToken).digest("hex");
}

// optional constant-time compare if comparing two unhashed values (not used here)
export function safeCompare(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return crypto.timingSafeEqual(bufA, bufB);
}
