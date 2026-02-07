const bcrypt = require("bcryptjs");
const User = require("../models/User");

const seedUsers = async () => {
  const users = [
    {
      name: "Super Admin",
      email: "superadmin@helpdesk.com",
      password: "super123",
      role: "SUPER_ADMIN",
    },
    {
      name: "Admin",
      email: "admin@helpdesk.com",
      password: "admin123",
      role: "ADMIN",
    },
    {
      name: "Manager",
      email: "manager@helpdesk.com",
      password: "manager123",
      role: "MANAGER",
    },
    {
      name: "Agent",
      email: "agent@helpdesk.com",
      password: "agent123",
      role: "AGENT",
    },
    {
      name: "Customer",
      email: "customer@helpdesk.com",
      password: "customer123",
      role: "CUSTOMER",
    },
  ];

  for (let user of users) {
    const exists = await User.findOne({ where: { email: user.email } });
    if (!exists) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      await User.create({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
      });

      console.log(`✅ ${user.role} created`);
    }
  }
};

module.exports = seedUsers;
