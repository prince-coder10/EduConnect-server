import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { hashRefreshToken, safeCompare } from "../utils/hash.js";
import UserStore from "../store/user.store.js";
import { ForbiddenError, UnauthorizedError } from "../errors/auth.errors.js";

export default class AuthService {
  constructor(private readonly userStore: UserStore) {}

  async refreshTokens(oldRefreshToken: string) {
    if (!oldRefreshToken)
      throw new UnauthorizedError("No refresh token provided");

    const payload = verifyRefreshToken(oldRefreshToken);
    if (!payload) throw new UnauthorizedError("Invalid refresh token");

    const user = await this.userStore.findById(payload.userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenError(
        "Forbidden! User not found or no refresh token stored"
      );

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedError("Token version mismatch");
    }

    const validToken: boolean = safeCompare(
      user.refreshToken.tokenHash,
      hashRefreshToken(oldRefreshToken)
    );
    if (!validToken) {
      user.refreshToken = null;
      await user.save();
      throw new UnauthorizedError("Invalid refresh token");
    }

    // 5️⃣ rotate refresh token
    const newRefreshToken = signRefreshToken({
      userId: user.id,
      tokenVersion: user.tokenVersion,
    });

    const newHash = hashRefreshToken(newRefreshToken);
    user.refreshToken = {
      tokenHash: newHash,
      createdAt: new Date(),
      lastUsedAt: new Date(),
    };
    await user.save();

    // 6️⃣ generate access token
    const accessToken = signAccessToken({
      userId: user.id,
      tokenVersion: user.tokenVersion,
    });

    return { user, accessToken, newRefreshToken };
  }
}
