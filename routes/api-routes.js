// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Grabbing our models

var db = require("../models");

require('dotenv').config();

// Routes
// =============================================================
module.exports = function(app) {

   // GET route for getting all of the repos
   app.get("/api/repos", function(req, res) {
    // findAll returns all entries for a table when used with no options
    // db.Todo.findAll({}).then(function(dbTodo) {
    //   // We have access to the todos as an argument inside of the callback function
    //   res.json(dbTodo);
    // });
    //Get all the user's repos fron GitHub using the graphQL api
    const url = 'https://api.github.com/graphql';

    // axios({
    //   method: 'post',
    //   url: url,
    //   //use env
    //   auth: {
    //     username: process.env.GIT_USERNAME,
    //     password: process.env.GIT_PASSWORD
    //   },
    //   data: {
    //     query: `{
    //       viewer {
    //         name
    //         repositories(first: 100) {
    //           nodes {
    //             name, id, url, isPrivate
    //           }
    //         }
    //       }
    //     }`
    //   }
      
    // })
    // .then(response => {
    //   // handle success
    //   console.log(response);
    //   console.log(response.data);
    //   console.log(response.data.data.viewer);
    //   console.log(response.data.data.viewer.repositories.nodes);
    //   const repos = response.data.data.viewer.repositories.nodes;
    // })
    // .catch(error => {
    //   // handle error
    //   console.log(error);
    // })
  });


  // GET route for getting all of the todos
  app.get("/api/todos", function(req, res) {
    // findAll returns all entries for a table when used with no options
    db.Todo.findAll({}).then(function(dbTodo) {
      // We have access to the todos as an argument inside of the callback function
      res.json(dbTodo);
    });
  });

  // POST route for saving a new todo
  app.post("/api/todos", function(req, res) {
    // create takes an argument of an object describing the item we want to
    // insert into our table. In this case we just we pass in an object with a text
    // and complete property
    db.Todo.create({
      text: req.body.text,
      complete: req.body.complete
    }).then(function(dbTodo) {
      // We have access to the new todo as an argument inside of the callback function
      res.json(dbTodo);
    });
  });

  // DELETE route for deleting todos. We can get the id of the todo to be deleted from
  // req.params.id
  app.delete("/api/todos/:id", function(req, res) {
    // We just have to specify which todo we want to destroy with "where"
    db.Todo.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbTodo) {
      res.json(dbTodo);
    });

  });

  // PUT route for updating todos. We can get the updated todo data from req.body
  app.put("/api/todos", function(req, res) {
    console.log(req.body);
    // Update takes in an object describing the properties we want to update, and
    // we use where to describe which objects we want to update
    db.Todo.update({
      text: req.body.text,
      complete: req.body.complete
    }, {
      where: {
        id: req.body.id
      }
    }).then(function(dbTodo) {
      res.json(dbTodo);
    });
  });
};
