const { Op } = require("sequelize");
const Ticket = require("../models/Ticket");
const User = require("../models/User");
const { sendEmail } = require("./notify");

exports.checkSlaBreaches = async () => {
  try {
    const now = new Date();

    // find breached tickets
    const tickets = await Ticket.findAll({
      where: {
        status: { [Op.ne]: "CLOSED" },
        resolutionDueAt: { [Op.lt]: now },
        isBreached: false,
      },
      include: [
        { model: User, as: "agent" },
        { model: User, as: "customer" },
      ],
    });

    for (let t of tickets) {
      // mark breached
      t.isBreached = true;
      await t.save();

      // send email to agent
      if (t.agent?.email) {
        await sendEmail(
          t.agent.email,
          "🚨 SLA Breached Ticket",
          `Ticket "${t.title}" has breached SLA.\nPlease resolve immediately.`
        );
      }

      console.log(`❌ SLA breached -> Ticket ${t.id}`);
    }

    console.log("✅ SLA check completed");
  } catch (err) {
    console.error("SLA checker error:", err);
  }
};
