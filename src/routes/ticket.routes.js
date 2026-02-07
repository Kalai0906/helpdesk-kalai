const express = require("express");
const router = express.Router();
const controller = require("../controllers/ticket.controller");
const upload = require("../middlewares/upload.middleware");
const { getCustomerOpenTickets } = require("../controllers/ticket.controller");
const ticketController = require("../controllers/ticket.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");
const {
  getBreachedTickets
} = require("../controllers/ticket.controller");


// Create ticket
router.post("/", upload.single("attachment"), controller.createTicket);

// List tickets
router.get("/", protect, controller.listTickets);

// Get single ticket
router.get("/:id", controller.getTicket);

// Update
router.patch("/:ticketId", protect, authorize("ADMIN", "AGENT"), controller.updateTicket);

// Delete
router.delete("/:id", controller.deleteTicket);

// Stats
router.get("/count", controller.getTicketCount);
router.get("/open", controller.getOpenTickets);
router.get("/closed", controller.getClosedTickets);
router.get("/reports/stats", controller.getTicketStats);
router.get("/breached", getBreachedTickets);

// Customer open tickets
router.get("/my-open", protect, authorize("CUSTOMER"), getCustomerOpenTickets);
router.get("/breached", getBreachedTickets);
router.put("/:id/assign", protect, authorize("ADMIN", "MANAGER"), ticketController.assignAgent);

router.put("/:id/status", protect, ticketController.updateStatus);

module.exports = router;
