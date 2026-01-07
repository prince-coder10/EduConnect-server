import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/auth.errors.js";
import UserStore from "../store/user.store.js";
import {
  hashPassword,
  hashRefreshToken,
  verifyPassword,
} from "../utils/hash.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
import {
  registerSchema,
  type RegisterInput,
} from "../validation/userValidation.js";

export default class UserService {
  constructor(private readonly userStore: UserStore) {}

  async registerUser(userData: RegisterInput) {
    const validInput = registerSchema.safeParse(userData);
    if (!validInput.success) {
      throw new BadRequestError("Invalid user data");
    }
    const hashedPassword = await hashPassword(userData.password);
    const newUser = await this.userStore.create({
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      password: hashedPassword,
      refreshToken: null,
      tokenVersion: 0,
      emailVerified: false,
    });
    return newUser;
  }

  async loginUser(email: string, password: string) {
    const user = await this.userStore.findByEmail(email);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const validation = await verifyPassword(user.password, password);
    if (!validation) {
      throw new UnauthorizedError("Invalid password");
    }

    const userId = user._id.toString();

    const refreshToken = signRefreshToken({
      userId,
      tokenVersion: user.tokenVersion,
    });

    const accessToken = signAccessToken({
      userId,
      tokenVersion: user.tokenVersion,
    });

    const hashedPassword = hashRefreshToken(refreshToken);

    user.refreshToken = {
      tokenHash: hashedPassword,
      createdAt: new Date(),
    };

    await user.save();
    return { user, accessToken };
  }

  // inside user.service.ts
  toSafeUser(user: any) {
    const obj = user.toObject ? user.toObject() : user;

    const { password, refreshToken, __v, ...safeUser } = obj;

    return safeUser;
  }

  async logoutUser(userId: string): Promise<void> {
    const user = await this.userStore.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    user.refreshToken = null;
    await user.save();
  }
}
