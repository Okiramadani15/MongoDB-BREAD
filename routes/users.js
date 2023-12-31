var express = require('express');
const { ObjectId } = require('mongodb');
var router = express.Router();

module.exports = function (db) {

  const User = db.collection('users')

  router.get('/', async function (req, res, next) {
    try {
      const { page = 1, limit = 5, query = '', sortBy  , sortMode } = req.query
      const sort = {}
      sort[sortBy] = sortMode == 'asc' ? 1 : -1
      const params = {}

      if (query) {
        params['$or'] = [{ "name": new RegExp(query, 'i') }, { "phone": new RegExp(query, 'i') }]
      }
      console.log(query)
      const offset = (page - 1) * limit

      const total = await User.count(params)
      console.log(limit)
      const pages = Math.ceil(total / limit)

      const users = await User.find(params).sort(sort).limit(parseInt(limit)).skip(offset).toArray();
      res.json({
        data: users,
        total,
        pages,
        page : Number(page),
        limit : Number(limit),
        offset
      })
    } catch (err) {
      res.status(500).json({ err })
    }
  });

 
  router.post('/', async function (req, res, next) {
    try {
      const { name, phone } = req.body
      const users = await User.insertOne({ name, phone })
      const data = await User.findOne({_id: users.insertedId})
      res.status(201).json(data)
    } catch (err){
      console.log(err)
      res.status(500).json({ err })
    }
  });

  router.get('/:id', async function (req, res, next) {
    try {
      const id = req.params.id
      const user = await User.findOne({ _id: new ObjectId(id) })
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json({ error })
    }
  });

  router.put('/:id', async function (req, res, next) {
    try {
      const { name, phone } = req.body
      const id = req.params.id
      const users = await User.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { name: name, phone: phone } },{returnDocument: "after"})
      res.status(201).json(users)
    } catch (err) {
      res.status(500).json({ err })
    }
  });



  router.delete('/:id', async function (req, res, next) {
    try {
      const id = req.params.id
      const users = await User.findOneAndDelete({ _id: new ObjectId(id) })
      res.status(200).json(users)
    } catch (err) {
      res.status(500).json({ err })
    }
  });

 
  return router;
}