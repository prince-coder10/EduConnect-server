import mongoose, { Schema, type HydratedDocument } from "mongoose";

export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  refreshToken?: IRefreshToken | null;
  tokenVersion: number;
  emailVerified: boolean;
}

export interface IRefreshToken {
  tokenHash: string;
  createdAt: Date;
  lastUsedAt?: Date;
}

const RefreshTokenSchema: Schema = new Schema({
  tokenHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastUsedAt: { type: Date },
});

const UserSchema: Schema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: RefreshTokenSchema, default: null },
  tokenVersion: { type: Number, default: 0 },
  emailVerified: { type: Boolean, default: false },
});

const User = mongoose.model<IUser>("User", UserSchema);
export type UserDocument = HydratedDocument<IUser>;
export default User;
