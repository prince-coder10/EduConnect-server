import User, { type IUser, type UserDocument } from "../models/User.js";

export default class UserStore {
  async create(user: IUser): Promise<UserDocument> {
    const userInstance = new User(user);
    await userInstance.save();
    return userInstance;
  }

  async findById(user_Id: string): Promise<UserDocument | null> {
    const user = await User.findById(user_Id);
    if (!user) return null;
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    const user = await User.findOne({ email });
    if (!user) return null;
    return user;
  }

  async getAll(): Promise<UserDocument[] | null> {
    const users = await User.find();
    if (!users) return null;
    return users;
  }

  async updateOne(
    user_id: string,
    updates: Partial<IUser>
  ): Promise<UserDocument | null> {
    const user = await User.findOneAndUpdate(
      { _id: user_id },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!user) return null;
    return user;
  }

  async deleteOne(user_id: string): Promise<void> {
    await User.findOneAndDelete({ _id: user_id });
  }
}
