const express = require('express');
const app = express();

const {mongoose} = require('./db/mongoose');

const bodyParser = require('body-parser');

const { List, Task } = require('./db/models');

app.use(bodyParser.json());

/**
 * GET /lists
 * Get all lists
 */

app.get('/lists', (req, res) => {
  List.find({}).then((lists)=>{
    res.send(lists);
  }).catch((e)=> {
    res.send(e);
  });
})

/**
 * POST /lists
 * Create a list
 */

app.post('/lists', (req, res) => {
  let title = req.body.title;

  let newList = new List({
    title
  });

  newList.save().then((listDoc)=>{
    res.send(listDoc);
  })
})

/**
 * PATCH /lists/:id
 * Update a specified list
 */

app.patch('/lists/:id', (req, res) => {
  List.findOneAndUpdate({_id: req.params.id},{
    $set: req.body
  }).then(()=>{
    res.sendStatus(200)
  });
});

/**
 * DELETE /lists/:id
 * Delete a list
 */

app.delete('/lists/:id', (req, res) => {
  List.findOneAndRemove({
    _id: req.params.id
  }).then((removeListDoc)=>{
    res.send(removeListDoc)
  });
});

/**
 * GET /lists/:listId/tasks
 * Get all tasks in a specific list
 */

app.get('/lists/:listId/tasks', (req, res) => {
  Task.find({
    _listId: req.params.listId
  }).then((tasks) => {
    res.send(tasks)
  });
});

/**
 * POST /lists/:listId/tasks
 * Create a new task in specific list
 */

app.post('/lists/:listId/tasks', (req, res) => {
  let newTask = new Task ({
    title: req.body.title,
    _listId: req.params.listId,
  })
  newTask.save().then((newTaskDoc) => {
    res.send(newTaskDoc)
  });
});

/**
 * PATCH /lists/:listId/tasks/:taskId
 * Update an existing task
 */

app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
  Task.findOneAndUpdate({
    _id: req.params.taskId,
    _listId: req.params.listId
  }, {
    $set: req.body
  }).then(() => {
    res.sendStatus(200)
  });
});

/**
 * DELETE /lists/:listId/tasks/:taskId
 * Delete a task
 */

app.delete('/lists/:listId/tasks/:taskId', (req, res) => {
  Task.findOneAndRemove({
    _id: req.params.taskId,
    _listId: req.params.listId
  }).then((removedTaskDoc)=>{
    res.send(removedTaskDoc)
  });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});