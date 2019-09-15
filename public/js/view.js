$(document).ready(function() {
  // Getting a reference to the input field where user adds a new todo
  const $newItemInput = $('input.new-item');
  // Our new todos will go inside the todoContainer
  const $todoContainer = $('.todo-container');
  // Adding event listeners for deleting, editing, and adding todos
  $(document).on('click', 'button.delete', deleteTodo);
  $(document).on('click', 'button.complete', toggleComplete);
  $(document).on('click', '.todo-item', editTodo);
  $(document).on('keyup', '.todo-item', finishEdit);
  $(document).on('blur', '.todo-item', cancelEdit);
  $(document).on('submit', '#todo-form', insertTodo);

  // Our initial repos array
  let currentRepos = [];
  // var repos = [];
  // var dbRepos = [];

  // Get user's repos when page loads
  // getRepos();
  // getDbRepos();

  // Function to map to just the api repo ids
  function getJustApiID(item) {
    const apiID = item.id;
    return apiID;
  }

  // Function to map to just the db repo ids
  function getJustDbID(item) {
    const dbID = item.repoID;
    return dbID;
  }

  // Function to map to get all the info of the different repos
  function getDiffRepos(item) {
    const dbID = item.repoID;
    return dbID;
  }

  // This function inserts a new repo into our database and then updates the view
  function insertRepo(difference, api) {
    console.log('Post a repo');

    // const repo = {
    //   repoID: '123',
    //   repoName: 'asdf',
    //   repoURL: 'asdfddd',
    //   repoPrivate: 0,
    //   timestamp: '2019-09-13 16:31:32',
    // };

    const newRepos = [];

    // Now create an array of objects with the repos we want to add
    for (let i = 0; i < difference.length; i++) {
      const repos = api.filter(function(repo) {
        return repo.id === difference[i];
      });

      // Gives me an array of objects each time
      console.log(repos);

      // Create an object to push
      const objRepo = {
        repoID: repos[0].id,
        repoName: repos[0].name,
        repoURL: repos[0].url,
        repoPrivate: repos[0].isPrivate,
        timestamp: repos[0].updatedAt,
      };

      // Push the object to the array
      newRepos.push(objRepo);
    }

    console.log('New Repos', newRepos);

    const repos = { newRepos };

    // $.post('/api/repos', difference, api, getAllRepos);
    $.post('/api/repos', repos).then(function(data) {
      console.log('Data!!!!', data);
      currentRepos = data;
      initializeRows();
    });
  }

  // Use Async/Await to get the repos from both the api and db so they return at the same time so I can compare
  async function getAllRepos() {
    try {
      console.log('getAllRepos Aysnc/Await has started');

      // Declare the routes
      // API repos
      const repoPromise = $.get('/api/repos');

      // db repos
      const dbRepoPromise = $.get('/api/dbRepos');

      // Wait for both to resolve
      const [api, db] = await Promise.all([repoPromise, dbRepoPromise]);
      console.log('API:', api);
      console.log('DB:', db);

      // Now compare the two
      // const a1 = ['a', 'b'];
      // const a2 = ['a', 'b', 'c', 'd'];

      // Get just the API repo ids
      const apiIDs = api.map(getJustApiID);
      console.log('Just the apiIDs:', apiIDs);

      // Get just the db repo ids
      const dbIDs = db.map(getJustDbID);
      console.log('Just the dbIDs:', dbIDs);

      const difference = apiIDs.filter(x => !dbIDs.includes(x));

      console.log('Difference Array:', difference);
      // console.log(difference.length);

      // const test = { id: 1, text: 'asdfa' };

      // Call the route to insert the repos
      // $.post('/api/repos', test);
      if (difference.length !== 0) {
        insertRepo(difference, api);
      } else {
        $.get('/api/dbRepos', function(data) {
          // repos = data;
          currentRepos = data;
          initializeRows();
        });
      }

      // This function grabs repos from the api
      // function getRepos() {
      //   $.get("/api/repos", function(data) {
      //     repos = data;
      //     //console.log(data);
      //     return data;
      //   });
      // }

      // This function grabs repos from the db
      // function getDbRepos() {
      //   $.get("/api/dbRepos", function(data) {
      //     dbRepos = data;
      //     //console.log(data);
      //     return data;
      //   });
      // }

      // const [a, b] = await Promise.all([promise1, promise2]);

      // console.log(`${ a } ${ b }`);

      // fire off three requests and save their promises
      // const apiPromise = getRepos();
      // const dbPromise = getDbRepos();
      // await both promises to come back and destructure the result into their own variables
      // const [api, db] = await Promise.all([apiPromise, dbPromise]);
      // console.log(repos, dbRepos); // cool, {...}, {....}
    } catch (e) {
      console.error(e); // 💩
    }
  }

  // Call the async/await function to get the repos
  getAllRepos();

  //! **********************************************

  // Our initial todos array
  let todos = [];

  // Getting todos from database when page loads
  getTodos();

  // This function resets the todos displayed with new todos from the database
  function initializeRows() {
    // $todoContainer.empty();
    // const rowsToAdd = [];
    for (let i = 0; i < currentRepos.length; i++) {
      //   // rowsToAdd.push(createNewRow(todos[i]));

      // <div className="card" style="width: 18rem;">
      //   <div className="card-body">
      //     <h5 className="card-title">Card title</h5>
      //     <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
      //     <p className="card-text">
      //       Some quick example text to build on the card title and make up the
      //       bulk of the card's content.
      //     </p>
      //     <a href="#" className="card-link">
      //       Card link
      //     </a>
      //     <a href="#" className="card-link">
      //       Another link
      //     </a>
      //   </div>
      // </div>;

      //       <div class="card" style="width: 18rem;">
      //   <img src="..." class="card-img-top" alt="...">
      //   <div class="card-body">
      //     <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
      //   </div>
      // </div>

      // <div className="card-deck"></div>;

      console.log(currentRepos[i]);

      const cardDeck = $('<div>');
      cardDeck.addClass('card-deck');

      const divCard = $('<div>');
      divCard.addClass('card');
      // divCard.css('width', '18rem');

      const cardImg = $('<img>');
      cardImg.addClass('card-img-top');
      cardImg.attr('src', '../images/react.png');

      const divCardBody = $('<div>');
      divCardBody.addClass('card-body');

      const cardH5 = $('<h5>');
      cardH5.addClass('card-title');
      cardH5.html(currentRepos[i].repoName);

      // const cardH6 = $('<h6>');
      // cardH6.addClass('card-subtitle');
      // cardH6.html(currentRepos[i].repoPrivate);

      const cardPrivate = $('<p>');
      cardPrivate.html(currentRepos[i].repoPrivate);

      const cardTime = $('<p>');
      cardTime.html(currentRepos[i].timestamp);

      const cardLink = $('<a>');
      cardLink.addClass('btn btn-primary');
      cardLink.attr('href', currentRepos[i].repoURL);
      cardLink.attr('target', '_blank');
      cardLink.text('Go to Repo');
      cardLink.addClass('link');

      divCardBody.append(cardH5, cardPrivate, cardTime, cardLink);
      divCard.append(cardImg, divCardBody);

      cardDeck.append(divCard);

      $('#results').append(cardDeck);
    }
    // $todoContainer.prepend(rowsToAdd);
  }

  // This function grabs todos from the database and updates the view
  function getTodos() {
    $.get('/api/todos', function(data) {
      todos = data;
      initializeRows();
    });
  }

  // This function deletes a todo when the user clicks the delete button
  function deleteTodo(event) {
    event.stopPropagation();
    const id = $(this).data('id');
    $.ajax({
      method: 'DELETE',
      url: `/api/todos/${id}`,
    }).then(getTodos);
  }

  // This function handles showing the input box for a user to edit a todo
  function editTodo() {
    const currentTodo = $(this).data('todo');
    $(this)
      .children()
      .hide();
    $(this)
      .children('input.edit')
      .val(currentTodo.text);
    $(this)
      .children('input.edit')
      .show();
    $(this)
      .children('input.edit')
      .focus();
  }

  // Toggles complete status
  function toggleComplete(event) {
    event.stopPropagation();
    const todo = $(this)
      .parent()
      .data('todo');
    todo.complete = !todo.complete;
    updateTodo(todo);
  }

  // This function starts updating a todo in the database if a user hits the "Enter Key"
  // While in edit mode
  function finishEdit(event) {
    const updatedTodo = $(this).data('todo');
    if (event.which === 13) {
      updatedTodo.text = $(this)
        .children('input')
        .val()
        .trim();
      $(this).blur();
      updateTodo(updatedTodo);
    }
  }

  // This function updates a todo in our database
  function updateTodo(todo) {
    $.ajax({
      method: 'PUT',
      url: '/api/todos',
      data: todo,
    }).then(getTodos);
  }

  // This function is called whenever a todo item is in edit mode and loses focus
  // This cancels any edits being made
  function cancelEdit() {
    const currentTodo = $(this).data('todo');
    if (currentTodo) {
      $(this)
        .children()
        .hide();
      $(this)
        .children('input.edit')
        .val(currentTodo.text);
      $(this)
        .children('span')
        .show();
      $(this)
        .children('button')
        .show();
    }
  }

  // This function constructs a todo-item row
  function createNewRow(todo) {
    const $newInputRow = $(
      [
        "<li class='list-group-item todo-item'>",
        '<span>',
        todo.text,
        '</span>',
        "<input type='text' class='edit' style='display: none;'>",
        "<button class='delete btn btn-danger'>x</button>",
        "<button class='complete btn btn-primary'>✓</button>",
        '</li>',
      ].join('')
    );

    $newInputRow.find('button.delete').data('id', todo.id);
    $newInputRow.find('input.edit').css('display', 'none');
    $newInputRow.data('todo', todo);
    if (todo.complete) {
      $newInputRow.find('span').css('text-decoration', 'line-through');
    }
    return $newInputRow;
  }

  // This function inserts a new todo into our database and then updates the view
  function insertTodo(event) {
    event.preventDefault();
    const todo = {
      text: $newItemInput.val().trim(),
      complete: false,
    };

    $.post('/api/todos', todo, getTodos);
    $newItemInput.val('');
  }
});