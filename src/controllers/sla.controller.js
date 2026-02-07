const SlaRule = require("../models/SlaRule");
const Ticket = require("../models/Ticket");
const { Op } = require("sequelize");


// CREATE / UPDATE SLA RULE
exports.setSlaRule = async (req, res) => {
  try {
    const { priority, responseTime, resolutionTime } = req.body;

    const [rule] = await SlaRule.upsert({
      priority,
      responseTime,
      resolutionTime,
    });

    res.json({
      message: "SLA rule saved",
      rule,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// GET SLA RULES
exports.getSlaRules = async (req, res) => {
  try {
    const rules = await SlaRule.findAll();
    res.json(rules);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// SLA CHECKER (runs every 1 min)
exports.checkSlaBreaches = async () => {
  try {
    const now = new Date();

    await Ticket.update(
      { isBreached: true },
      {
        where: {
          status: { [Op.ne]: "Closed" },
          resolutionDueAt: { [Op.lt]: now },
          isBreached: false
        }
      }
    );

    console.log("✅ SLA Breach check completed");
  } catch (err) {
    console.error("❌ SLA check error:", err);
  }
};
