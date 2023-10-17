var express = require("express");
var router = express.Router();

module.exports = function (db) {
  const User = db.collection('documents');
  router.get("/", async function (req, res, next) {
    try {
      const users = await User.find({}).toArray();
      res.json(users);
    } catch (err) {
      res.status(500).json({ err });
    }
  });

  return router;
};
