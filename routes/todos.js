var express = require("express");
const { objectId, ObjectId } = require("mongodb");
var router = express.Router();

module.exports = function (db) {
  const todo = db.collection("todos");
  router.get("/", async function (req, res, next) {
    try {
      const { title,deadline,startDate, endDate,complete } = req.query;
      const params = {};
      if (title) {
        params["title"] = new RegExp(title, "i");
      }
      if (startDate && endDate ) {
        params["deadline"] = {deadline:
        { 
          $gte: new Date(startDate),
          $lte: new Date(endDate) 
        }}} 
      if (complete) {
        params["complete"] = JSON.parse(complete) 
      }
      const todos = await todo.find(params).toArray();
      res.json(todos);
    } catch (err) {
      res.status(500).json({ err });
      
    }
  });

  router.post("/", async function (req, res, next) {
    try {
      const {name, phone} = req.body
      const users = await User.insertOne({
        name: name,
        phone: phone})
      res.status(201).json(users);
    } catch (err) {
      res.status(500).json({ err });
    }
  });

  router.get("/:id", async function (req, res, next) {
    try {
      const id = req.params
      const users = await User.findOne({_id: new ObjectId(id) })
      res.status(201).json(users);
    } catch (err) {
      res.status(500).json({ err });
    }
  });

  router.put("/:id", async function (req, res, next) {
    try {
      const id = req.params
      const {name,phone} = req.body
      const users = await User.updateOne({_id: new ObjectId(id)},  {
        $set: { name:name, 
                phone:phone }})
      res.status(201).json(users);
    } catch (err) {
      res.status(500).json({ err });
    }
  });

  router.delete("/:id", async function (req, res, next) {
    try {
      const id = req.params 
      const users = await User.deleteOne({_id: new ObjectId(id) })
      res.status(201).json(users);
    } catch (err) {
      res.status(500).json({ err });
    }
  });

  return router;
};
