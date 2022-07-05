const express = require("express");
const Order = require("../models/order");
const security = require("../middleware/security");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    // const orders = await Order.listOrdersForUser();
    // return res.status(200).json({ orders });
  } catch (err) {
    next(err);
  }
});

router.post("/", security.requireAuthenticatedUser, async (req, res, next) => {
  try {
    const { user } = res.locals;
    console.log("user", user);
    const order = await Order.createOrder(user, req.body);
    return res.status(200).json({ order });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
