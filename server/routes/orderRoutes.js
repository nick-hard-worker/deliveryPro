const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const requireCredits = require("../middleware/requireCredits");

const Order = mongoose.model("Order");

module.exports = app => {
  app.get("/api/order/thanks", (req, res) => {
    res.send("Thank you for ordering");
  });

  app.post("/api/orders", requireLogin, requireCredits, async (req, res) => {
    const { description, origin, destination, volume } = req.body;

    const order = new Order({
      description,
      origin,
      destination,
      volume,
      _user: req.user.id,
      dateOrdered: Date.now()
    });

    try {
      await order.save();
      req.user.credits -= 50;
      const user = await req.user.save();

      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });

  app.get("/admin/api/all_orders", requireLogin, async (req, res) => {
    const orders = await Order.find({});

    res.send(orders);
  });
  app.get("/api/orders", requireLogin, async (req, res) => {
    const orders = await Order.find({ _user: req.user.id });

    res.send(orders);
  });
  app.put("/admin/api/orders/:id", requireLogin, async (req, res) => {
    let { recieved, delivered } = req.body;
    let dateRecieved, dateDelivered;

    if (!delivered && recieved) {
      delivered = false;
      dateRecieved = Date.now();
      try {
        const order = await Order.update(
          { _id: req.params.id },
          {
            recieved: recieved,
            delivered: delivered,
            dateRecieved: dateRecieved
          }
        );
        res.send(order);
      } catch (err) {
        res.status(422).send(err);
      }
    } else if (!recieved && delivered) {
      recieved = true;
      dateDelivered = Date.now();
      try {
        const order = await Order.update(
          { _id: req.params.id },
          {
            recieved: recieved,
            delivered: delivered,
            dateDelivered: dateDelivered
          }
        );
        res.send(order);
      } catch (err) {
        res.status(422).send(err);
      }
    }
  });
  app.get("/admin/api/orders/:id", requireLogin, async (req, res) => {
    try {
      const order = await Order.find({ _id: req.params.id });
      res.send(order);
    } catch (err) {
      res.status(422).send(err);
    }
  });

  app.get("/admin/api/metrics", requireLogin, async (req, res) => {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const newOrders = await Order.find({
        dateOrdered: { $gte: today }
      });
      const recievedOrders = await Order.find({
        dateRecieved: { $gte: today }
      });

      const deliveredOrders = await Order.find({
        dateDelivered: { $gte: today }
      });

      const metrics = {
        newOrders: newOrders.length,
        recievedOrders: recievedOrders.length,
        deliveredOrders: deliveredOrders.length
      };

      res.send(metrics);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};
