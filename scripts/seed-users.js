const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const users = [
    { email: "admin@test.com", password: "admin123", role: "admin" },
    { email: "user@test.com", password: "user123", role: "user" },
  ];

  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10);
    await User.updateOne(
      { email: u.email },
      { $set: { email: u.email, password: hashed, role: u.role } },
      { upsert: true },
    );
    console.log(`Upserted ${u.role}: ${u.email} / ${u.password}`);
  }

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
