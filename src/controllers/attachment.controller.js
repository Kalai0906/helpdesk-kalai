const Attachment = require("../models/Attachment");

exports.uploadAttachment = async (req, res) => {
  try {
    const { ticketId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const attachment = await Attachment.create({
      fileName: req.file.originalname,
      filePath: req.file.path,
      uploadedBy: req.user.id,
      ticketId,
    });

    res.status(201).json({
      message: "File uploaded successfully",
      attachment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};
