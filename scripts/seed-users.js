const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
    walletAddress: {
      type: String,
      lowercase: true,
      trim: true,
      match: /^0x[a-f0-9]{40}$/,
      sparse: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const users = [
    {
      email: "superadmin@test.com",
      password: "super123",
      role: "superadmin",
      walletAddress: "0x078eD8942d1e1c48e9b8a13c1Cd86c2b7f57eA4F",
    },
    { email: "user@test.com", password: "user123", role: "user" },
  ];

  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10);
    const update = {
      email: u.email,
      password: hashed,
      role: u.role,
    };
    if (u.walletAddress) {
      update.walletAddress = u.walletAddress.toLowerCase();
    }
    await User.updateOne(
      { email: u.email },
      { $set: update },
      { upsert: true },
    );
    console.log(
      `Upserted ${u.role}: ${u.email} / ${u.password}${
        u.walletAddress ? ` · ${u.walletAddress}` : ""
      }`,
    );
  }

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
