const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createAdmin = async () => {
  const adminExists = await User.findOne({
    where: { email: "admin@test.com" },
  });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Admin",
      email: "admin@test.com",
      password: hashedPassword,
      role: "ADMIN",
    });

    console.log("Default admin user created");
  }
};

module.exports = createAdmin;
