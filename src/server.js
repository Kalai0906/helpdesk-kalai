require("dotenv").config();

const app = require("./app");
const sequelize = require("./config/db");

const createAdmin = require("./utils/createAdmin");
const cron = require("node-cron");
const { checkSlaBreaches } = require("./utils/slaChecker");

const seedUsers = require("./utils/seedUsers");
const commentRoutes = require("./routes/comment.routes");
const PORT = process.env.PORT || 5000;

// ✅ ROUTES
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/tickets", require("./routes/ticket.routes"));
app.use("/api/reports", require("./routes/report.routes"));
app.use("/api/notifications", require("./routes/notification.routes"));
app.use("/api/comments", require("./routes/comment.routes"));

sequelize.sync().then(async () => {
  console.log("Database connected & synced");

  await seedUsers();
  await createAdmin();

  // SLA checker
  // run every 1 minute
 // SLA checker (every 1 minute)
  cron.schedule("* * * * *", () => {
    checkSlaBreaches();
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
app.get("/create-admin", async (req, res) => {
  const bcrypt = require("bcryptjs");

  const user = await User.create({
    name: "Admin",
    email: "admin@test.com",
    password: await bcrypt.hash("123456", 10),
    role: "Admin",
  });

  res.send("Admin created");
});
