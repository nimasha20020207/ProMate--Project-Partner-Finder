const express = require("express");
const router = express.Router();
const Notification = require("../models/notification");

// Add notification
router.post("/", (req, res) => {
    Notification.create(req.body)
        .then((notif) => res.json({ msg: "notification added successfully", data: notif }))
        .catch((err) => res.status(400).json({ msg: "unable to add notification", error: err }));
});

// Get all notifications
router.get("/", (req, res) => {
    const filter = req.query.targetIt ? { targetIt: req.query.targetIt } : {};
    Notification.find(filter).sort({ createdAt: -1 }) // newest first
        .then((nots) => res.json(nots))
        .catch((err) => res.status(400).json({ msg: "unable to fetch notifications", error: err }));
});

// Delete notification by id
router.delete("/:id", (req, res) => {
    Notification.findByIdAndDelete(req.params.id)
        .then(() => res.json({ msg: "notification deleted successfully" }))
        .catch((err) => res.status(400).json({ msg: "unable to delete notification", error: err }));
});

module.exports = router;
