var express = require('express');
const { ObjectId } = require('mongodb');
var router = express.Router();
var moment = require('moment');
const users = require('./users');


module.exports = function (db) {

    const Todo = db.collection('todos')
    const User = db.collection('users')

    router.get('/', async function (req, res, next) {
        try {
            const {limit = 5, page = 1, title, complete, startdateDeadline, enddateDeadline, sortBy = '_id', sortMode ='asc', executor } = req.query
            const sort = {}
            const params = {}
            sort[sortBy] = sortMode
            console.log(startdateDeadline,enddateDeadline)


            if (executor) params['executor'] = executor
            if (title) params['title'] = new RegExp(title, 'i')
            if (complete) params['complete'] = JSON.parse(complete)
            if (startdateDeadline && enddateDeadline) {
                params['deadline'] = {$gte: new Date(startdateDeadline), $lte: new Date (enddateDeadline)}
            } else if (startdateDeadline) {
                params['deadline'] = { $gte: new Date(startdateDeadline) }
            } else if (enddateDeadline) {
                params['deadline'] = { $lte: new Date (enddateDeadline )}
            }
            

            const offset = (page - 1) * limit
            const total = await Todo.count(params)
            const pages = Math.ceil(total / limit)
            console.log('params',params)
            const todos = await Todo.find(params).sort(sort).limit(Number(limit)).skip(offset).toArray();
            console.log(todos)
            res.json({
                data: todos,
                total,
                pages,
                page : Number(page),
                limit : Number(limit),
                moment
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({ err })
        }
    });

    router.post('/', async function (req, res, next) {
        try {
            const { title, executor } = req.body
            const todos = await Todo.insertOne({ title: title, complete: false, deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), executor})
            const data = await Todo.findOne({ _id: new ObjectId(todos.insertedId.toString())})
            console.log(data)
            res.status(201).json(data)
        } catch (err) {
            console.log("ini error", err)
            res.status(500).json({ err })
        }
    });

    router.get('/:id', async function (req, res, next) {
        try {
            const id = req.params.id
            const todos = await Todo.findOne({ _id: new ObjectId(id) })
            console.log('ini todos', todos)
            res.status(200).json(todos)
        } catch (err) {
            res.status(500).json({ err })
        }
    });

    router.put('/:id', async function (req, res, next) {
        try {
            const { title, deadline, complete } = req.body
            const id = req.params.id
            const todos = await Todo.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { title: title, deadline: new Date(deadline), complete: complete }},{returnDocument: "after"})
            if(todos) {
                res.status(201).json(todos)
            } else {
                res.status(500).json({message: `Todo Not Found`})
            }
        } catch (err) {
            res.status(500).json({ err })
        }
    });


    router.delete('/:id', async function (req, res, next) {
        try {
            const id = req.params.id
            const todos = await Todo.findOneAndDelete({ _id: new ObjectId(id) })

            if(todos) {
                res.status(200).json(todos)
            } else {
                res.status(500).json({ message: 'Todo Not Found'})
            }
        } catch (err) {
            res.status(500).json({ err })
        }
    });

   
    return router;
}