// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Require Axios
const axios = require('axios');

// Grabbing our models
const db = require('../models');

// Routes
// =============================================================
module.exports = function(app) {
  // GET route for getting all of the repos
  app.get('/api/repos', function(req, res) {
    // findAll returns all entries for a table when used with no options
    // db.Todo.findAll({}).then(function(dbTodo) {
    //   // We have access to the todos as an argument inside of the callback function
    //   res.json(dbTodo);
    // });
    // Get all the user's repos fron GitHub using the graphQL api
    const url = 'https://api.github.com/graphql';

    console.log(process.env.GIT_USERNAME);

    axios({
      method: 'post',
      url,
      // use env
      auth: {
        username: process.env.GIT_USERNAME,
        password: process.env.GIT_PASSWORD,
      },
      data: {
        query: `{
          viewer {
            name
            repositories(first: 100) {
              nodes {
                id, name, url, isPrivate, updatedAt
              }
            }
          }
        }`,
      },
    })
      .then(response => {
        // handle success
        // console.log(response);
        // console.log(response.data);
        // console.log(response.data.data.viewer);
        // console.log(response.data.data.viewer.repositories.nodes);
        const repos = response.data.data.viewer.repositories.nodes;
        res.json(repos);
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
  });

  // GET route for getting all of the repos from the db
  app.get('/api/dbRepos', function(req, res) {
    // findAll returns all entries for a table when used with no options
    db.Repo.findAll({}).then(function(dbRepo) {
      // We have access to the repos as an argument inside of the callback function
      res.json(dbRepo);
    });
  });

  // GET route for getting all of the repo tags from the db
  app.get('/api/dbRepoTags', function(req, res) {
    // findAll returns all entries for a table when used with no options
    db.RepoTag.findAll({}).then(function(dbRepoTags) {
      // We have access to the repos as an argument inside of the callback function
      res.json(dbRepoTags);
    });
  });

  // POST route for saving the repos from the api to the db
  // app.post('/api/repos', function(req, res) {
  // console.log(req.body.id);

  // create takes an argument of an object describing the item we want to
  // insert into our table. In this case we just we pass in an object with a text
  // and complete property
  // req.forEach(element => {
  // console.log(element);
  // Find the repo that matches the one if difference and add to the db
  // db.users.findOne({
  //   id: 'c0eebc45-9c0b-4ef8-bb6d-6bb9bd380a13'
  // })
  // .then(user => {
  //   console.log(`Found user: ${user}`);
  // });
  // db.Repo.create({
  //   text: req.body.text,
  //   complete: req.body.complete,
  // }).then(function(dbTodo) {
  //   // We have access to the new todo as an argument inside of the callback function
  //   //res.json(dbTodo);
  // });
  // });
  // });

  // POST route for saving a new repo
  app.post('/api/repos', function(req, res) {
    // create takes an argument of an object describing the item we want to
    // insert into our table. In this case we just we pass in an object with a text
    // and complete property

    // console.log(req.body.repoName);

    console.log(req.body);

    for (let i = 0; i < req.body.newRepos.length; i++) {
      console.log(req.body.newRepos[i].repoID);

      db.Repo.create({
        repoID: req.body.newRepos[i].repoID,
        repoName: req.body.newRepos[i].repoName,
        repoURL: req.body.newRepos[i].repoURL,
        repoPrivate: req.body.newRepos[i].repoPrivate,
        timestamp: req.body.newRepos[i].timestamp,
      }).then(function(dbRepo) {
        // We have access to the new todo as an argument inside of the callback function
        // res.json(dbRepo);
        // Need to send back the new db repo
        db.Repo.findAll({}).then(function(dbRepo) {
          // We have access to the repos as an argument inside of the callback function
          res.json(dbRepo);
        });
      });
    }
  });

  // GET route for getting all of the tags
  app.get('/api/tags', function(req, res) {
    // Count how many tags
    db.Tag.count().then(c => {
      console.log(`There are ${c} tags!`);
      // If no Tags create the defaults
      if (c === 0) {
        db.Tag.bulkCreate([
          { tagName: 'HTML', tagColor: '#FFE933' },
          { tagName: 'CSS', tagColor: '#FF6E33' },
          { tagName: 'Node', tagColor: '#ABA6A5' },
          { tagName: 'JavaScript', tagColor: '#7E5B6C' },
          { tagName: 'JQUERY', tagColor: '#9116D8' },
        ]).then(Tags => {
          console.log(Tags);
          res.json(Tags);
        });
      } else {
        db.Tag.findAll({}).then(function(dbTag) {
          // We have access to the tags as an argument inside of the callback function
          res.json(dbTag);
        });
      }
    });

    // db.Tag.findOrCreate({
    //   where: { id: 1 }, // we search for this is
    //   defaults: [
    //     { tagName: 'HTML', tagColor: '#FFE933' },
    //     { tagName: 'CSS', tagColor: '#FF6E33' },
    //   ],
    // }).then(function() {
    //   // We have access to the new todo as an argument inside of the callback function
    //   // res.json(dbTodo);
    //   // findAll returns all entries for a table when used with no options
    //   db.Tag.findAll({}).then(function(dbTag) {
    //     // We have access to the tags as an argument inside of the callback function
    //     res.json(dbTag);
    //   });
    // });
  });

  // GET route for getting all of the repo tags
  app.get('/api/repotags/:repoid', function(req, res) {
    // findAll returns all entries for a table when used with no options
    console.log('repoID Param', req.params.repoid);
    console.log(typeof req.params.repoid);
    console.log(req.params.repoid);
    const paramRepoID = parseInt(req.params.repoid);
    console.log(paramRepoID);

    db.RepoTag.findAll({
      where: { repoID: paramRepoID },
    }).then(function(dbRepoTag) {
      // We have access to the tags as an argument inside of the callback function
      res.json(dbRepoTag);
    });
    // sequelize
    //   .query(
    //     'SELECT * FROM `RepoTags` LEFT JOIN `Tags` on RepoTags.tagID = Tags.id'
    //   )
    //   .then(function(results) {
    //     console.log(results);
    //     res.json(results);
    //   });
    // db.query(
    //   `
    //   SELECT
    //     RepoTags.id,
    //     RepoTags.tagID
    //   FROM
    //     RepoTags
    //   WHERE
    //   RepoTags.tagID = Tags.id`,
    //   { type: sequelize.QueryTypes.SELECT }
    // ).then(function(results) {
    //   console.log('Results:', results);
    //   res.json(results);
    // });
  });

  // POST route for saving a new repo tag
  app.post('/api/repotags', function(req, res) {
    // create takes an argument of an object describing the item we want to
    // insert into our table. In this case we just we pass in an object with a text
    // and complete property

    console.log('RepoID:', req.body.repoID);
    console.log(typeof req.body.repoID);

    const repoID = parseInt(req.body.repoID);

    console.log(typeof repoID);
    console.log(repoID);

    db.RepoTag.create({
      tagID: req.body.tagID,
      repoID,
    }).then(function(dbRepoTag) {
      // We have access to the new todo as an argument inside of the callback function
      res.json(dbRepoTag);
    });
  });

  // DELETE route for deleting repos. We can get the id of the todo to be deleted from
  // req.params.id
  app.delete('/api/repotags/:id', function(req, res) {
    // We just have to specify which repo we want to destroy with "where"
    console.log(req.params.id);

    db.RepoTag.destroy({
      where: {
        tagID: req.params.id,
      },
    }).then(function(dbRepoTags) {
      res.json(dbRepoTags);
    });
  });

  // POST route for saving a new repo tag
  app.post('/api/tag', function(req, res) {
    db.Tag.create({
      tagName: req.body.tagName,
      tagColor: req.body.tagColor,
    }).then(function(dbTag) {
      // We have access to the new todo as an argument inside of the callback function
      res.json(dbTag);
    });
  });

  // Update the tag name
  app.put('/api/tags', function(req, res) {
    console.log(req.body);
    // Update takes in an object describing the properties we want to update, and
    // we use where to describe which objects we want to update
    db.Tag.update(
      {
        tagName: req.body.tagName,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    ).then(function(dbTag) {
      res.json(dbTag);
    });
  });

  // Delete the tag name
  app.delete('/api/tags/:id', function(req, res) {
    // We just have to specify which todo we want to destroy with "where"
    db.Tag.destroy({
      where: {
        id: req.params.id,
      },
    }).then(function(dbTag) {
      res.json(dbTag);
    });

    // todo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Need to delete all the related tags in repoTags
  });

  //! ******************************************

  // POST route for saving a new todo
  app.post('/api/todos', function(req, res) {
    // create takes an argument of an object describing the item we want to
    // insert into our table. In this case we just we pass in an object with a text
    // and complete property
    db.Todo.create({
      text: req.body.text,
      complete: req.body.complete,
    }).then(function(dbTodo) {
      // We have access to the new todo as an argument inside of the callback function
      res.json(dbTodo);
    });
  });

  // DELETE route for deleting todos. We can get the id of the todo to be deleted from
  // req.params.id
  app.delete('/api/todos/:id', function(req, res) {
    // We just have to specify which todo we want to destroy with "where"
    db.Todo.destroy({
      where: {
        id: req.params.id,
      },
    }).then(function(dbTodo) {
      res.json(dbTodo);
    });
  });

  // PUT route for updating todos. We can get the updated todo data from req.body
  app.put('/api/todos', function(req, res) {
    console.log(req.body);
    // Update takes in an object describing the properties we want to update, and
    // we use where to describe which objects we want to update
    db.Todo.update(
      {
        text: req.body.text,
        complete: req.body.complete,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    ).then(function(dbTodo) {
      res.json(dbTodo);
    });
  });
};
