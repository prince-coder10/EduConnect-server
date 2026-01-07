import type { Request, Response } from "express";
import UserService from "../../services/user.service.js";
import UserStore from "../../store/user.store.js";
import { catchError } from "../../utils/catchError.js";

const User = new UserService(new UserStore());

export const registerUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const newUser = await User.registerUser({
      firstname,
      lastname,
      email,
      password,
    });

    if (!newUser)
      return res
        .status(400)
        .json({ success: false, message: "User registration failed" });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: User.toSafeUser(newUser),
    });
  } catch (error) {
    console.log("Error registering user:", error);
    return catchError(res, error);
  }
};
