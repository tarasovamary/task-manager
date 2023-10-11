const express = require('express');
const app = express();

const {mongoose} = require('./db/mongoose');

const bodyParser = require('body-parser');

const { List, Task, User } = require('./db/models');

app.use(bodyParser.json());

// CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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
    res.send({message: 'Updated successfully'})
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

/* USER ROUTES */

/**
 * POST /users
 * Sign up
 */

 app.post('/users', (req, res) => {
  // User sign up

  let body = req.body;
  let newUser = new User(body);

  newUser.save().then(() => {
      return newUser.createSession();
  }).then((refreshToken) => {
      // Session created successfully - refreshToken returned.
      // now we geneate an access auth token for the user

      return newUser.generateAccessAuthToken().then((accessToken) => {
          // access auth token generated successfully, now we return an object containing the auth tokens
          return { accessToken, refreshToken }
      });
  }).then((authTokens) => {
      // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
      res
          .header('x-refresh-token', authTokens.refreshToken)
          .header('x-access-token', authTokens.accessToken)
          .send(newUser);
  }).catch((e) => {
      res.status(400).send(e);
  })
})

/**
 * POST /users/login
 * Login
 */

 app.post('/users/login', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  User.findByCredentials(email, password).then((user) => {
      return user.createSession().then((refreshToken) => {
          // Session created successfully - refreshToken returned.
          // now we geneate an access auth token for the user

          return user.generateAccessAuthToken().then((accessToken) => {
              // access auth token generated successfully, now we return an object containing the auth tokens
              return { accessToken, refreshToken }
          });
      }).then((authTokens) => {
          // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
          res
              .header('x-refresh-token', authTokens.refreshToken)
              .header('x-access-token', authTokens.accessToken)
              .send(user);
      })
  }).catch((e) => {
      res.status(400).send(e);
  });
})

/**
 * GET /users/me/access-token
 * Purpose: generates and returns an access token
 */
 app.get('/users/me/access-token', verifySession, (req, res) => {
  // we know that the user/caller is authenticated and we have the user_id and user object available to us
  req.userObject.generateAccessAuthToken().then((accessToken) => {
      res.header('x-access-token', accessToken).send({ accessToken });
  }).catch((e) => {
      res.status(400).send(e);
  });
})

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});