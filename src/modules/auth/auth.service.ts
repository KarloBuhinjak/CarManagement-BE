import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.model";

export const registerUser = async (email: string, password: string) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);

  if (!match) throw new Error("Invalid credentials");

  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" },
  );

  return { token };
};

export const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId)
    .select("email role walletAddress createdAt updatedAt")
    .lean();
  return user;
};

export const getInvitation = async (token: string) => {
  const user = await User.findOne({ passwordSetupToken: token })
    .select("email passwordSetupExpiresAt")
    .lean();

  if (!user) {
    throw new Error("Invitation not found or already used");
  }

  if (
    !user.passwordSetupExpiresAt ||
    user.passwordSetupExpiresAt.getTime() < Date.now()
  ) {
    throw new Error("Invitation has expired");
  }

  return { email: user.email };
};

export const consumeInvitation = async (token: string, newPassword: string) => {
  const user = await User.findOne({ passwordSetupToken: token });

  if (!user) {
    throw new Error("Invitation not found or already used");
  }

  if (
    !user.passwordSetupExpiresAt ||
    user.passwordSetupExpiresAt.getTime() < Date.now()
  ) {
    throw new Error("Invitation has expired");
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  user.passwordSetupToken = undefined;
  user.passwordSetupExpiresAt = undefined;
  await user.save();
};
