import bcrypt from "bcrypt";
import crypto from "crypto";
import { User } from "../../models/user.model";
import { sendMechanicInvitationEmail } from "../../services/email.service";

const INVITATION_TTL_HOURS = 24;
const TOKEN_BYTE_LENGTH = 32;

export const listMechanics = async () => {
  const mechanics = await User.find({ role: "admin" })
    .select("email role walletAddress createdAt updatedAt passwordSetupToken")
    .sort({ createdAt: -1 })
    .lean();

  return mechanics.map((m) => ({
    _id: m._id,
    email: m.email,
    role: m.role,
    walletAddress: m.walletAddress,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
    isPending: Boolean(m.passwordSetupToken),
  }));
};

const buildInvitationLink = (token: string): string => {
  const base = process.env.APP_URL ?? "http://localhost:5173";
  return `${base.replace(/\/$/, "")}/set-password?token=${token}`;
};

export const createMechanic = async (
  email: string,
  walletAddress: string,
) => {
  const normalizedWallet = walletAddress.toLowerCase();

  const existingByEmail = await User.findOne({ email });
  if (existingByEmail) {
    throw new Error("User with this email already exists");
  }

  const existingByWallet = await User.findOne({
    walletAddress: normalizedWallet,
  });
  if (existingByWallet) {
    throw new Error("User with this wallet address already exists");
  }

  const token = crypto.randomBytes(TOKEN_BYTE_LENGTH).toString("hex");
  const expiresAt = new Date(
    Date.now() + INVITATION_TTL_HOURS * 60 * 60 * 1000,
  );

  // Placeholder password hash — user replaces it via set-password link.
  const placeholderPassword = crypto.randomBytes(32).toString("hex");
  const hashedPassword = await bcrypt.hash(placeholderPassword, 10);

  const mechanic = await User.create({
    email,
    password: hashedPassword,
    role: "admin",
    walletAddress: normalizedWallet,
    passwordSetupToken: token,
    passwordSetupExpiresAt: expiresAt,
  });

  const invitationLink = buildInvitationLink(token);

  try {
    await sendMechanicInvitationEmail({ to: email, invitationLink });
  } catch (error) {
    // Roll back the user if mail failed — otherwise we have an orphaned account.
    await User.deleteOne({ _id: mechanic._id });
    throw new Error(
      `Failed to send invitation email: ${
        error instanceof Error ? error.message : "unknown error"
      }`,
    );
  }

  const { password: _password, passwordSetupToken: _t, ...safe } =
    mechanic.toObject();
  return { ...safe, isPending: true };
};

export const removeMechanic = async (id: string) => {
  const mechanic = await User.findById(id).lean();
  if (!mechanic) {
    throw new Error("Mechanic not found");
  }
  if (mechanic.role !== "admin") {
    throw new Error("Only mechanics can be removed through this endpoint");
  }
  await User.deleteOne({ _id: id });
  return { removedId: id, email: mechanic.email };
};
