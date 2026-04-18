import bcrypt from "bcrypt";
import { User } from "../../models/user.model";

export const listMechanics = async () => {
  const mechanics = await User.find({ role: "admin" })
    .select("email role createdAt updatedAt")
    .sort({ createdAt: -1 })
    .lean();
  return mechanics;
};

export const createMechanic = async (email: string, password: string) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const mechanic = await User.create({
    email,
    password: hashedPassword,
    role: "admin",
  });

  const { password: _password, ...safeMechanic } = mechanic.toObject();
  return safeMechanic;
};
