$(document).ready(function() {
  // Adding event listeners for deleting, editing, and adding todos
  $(document).on('click', 'button.delete', deleteTodo);
  $(document).on('click', 'button.complete', toggleComplete);
  $(document).on('click', '.todo-item', editTodo);
  $(document).on('keyup', '.todo-item', finishEdit);
  $(document).on('blur', '.todo-item', cancelEdit);
  $(document).on('submit', '#todo-form', insertTodo);

  //! *************************************
  // Add Repo tag button, call insertTag
  // $(document).on('click', '#btnAddRepoTag', openTag);

  // The initial repos array
  let currentRepos = [];

  // The initial tags array
  let tags = [];

  // The initial repo tags array
  let repoTags = [];

  // This function displays repos from the database
  function initializeRows() {
    // Build the card column element
    const cardCol = $('<div>');
    cardCol.addClass('card-columns');

    // Loop over the db repos
    for (let i = 0; i < currentRepos.length; i++) {
      // console.log(currentRepos[i]);

      // Build the card elements
      const divCard = $('<div>');
      divCard.addClass('card');
      divCard.css('width', '15rem');

      const cardImg = $('<img>');
      cardImg.addClass('card-img-top');
      cardImg.attr('src', '../images/react.png');

      const divCardBody = $('<div>');
      divCardBody.addClass('card-body');

      const btnID = `btnAddRepoTag${i}`;

      const cardTags = $('<div>');
      const btnAddTag = $(
        `<button id="${btnID}" type="button" class="btn btn-success btn-sm" data-toggle="popover" rel='popover'>Add Tag</button>`
      );

      cardTags.append(btnAddTag);

      const cardH5 = $('<h5>');
      cardH5.addClass('card-title');
      cardH5.html(currentRepos[i].repoName);

      // const cardH6 = $('<h6>');
      // cardH6.addClass('card-subtitle');
      // cardH6.html(currentRepos[i].repoPrivate);

      const cardPrivate = $('<p>');
      cardPrivate.html(`Private Repo: ${currentRepos[i].repoPrivate}`);

      const cardTime = $('<p>');
      cardTime.html(`Last Edited: ${currentRepos[i].timestamp}`);

      const cardLink = $('<a>');
      cardLink.addClass('btn btn-primary');
      cardLink.attr('href', currentRepos[i].repoURL);
      cardLink.attr('target', '_blank');
      cardLink.text('Go to Repo');
      cardLink.addClass('link');

      divCardBody.append(cardTags, cardH5, cardPrivate, cardTime, cardLink);
      divCard.append(cardImg, divCardBody);

      cardCol.append(divCard);
    }
    // Append the cards to the index.html div
    $('#results').append(cardCol);
  }

  function displayTags() {
    console.log('In display tags');

    // Loop over the db tags
    for (let i = 0; i < tags.length; i++) {
      // console.log(tags[i].tagName);

      const btnTag = $('<button>');
      btnTag.addClass('btn btn-sm');
      btnTag.css('background-color', tags[i].tagColor);
      btnTag.text(tags[i].tagName);

      $('#tags').append(btnTag);
    }
  }

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
  // function getDiffRepos(item) {
  //   const dbID = item.repoID;
  //   return dbID;
  // }

  // This function inserts a new repo into our database and then updates the view
  function insertRepo(difference, api) {
    console.log('Post a repo');

    // Create an Array to hold the different repos
    const newRepos = [];

    // Now create an array of objects with the repos we want to add
    for (let i = 0; i < difference.length; i++) {
      const repos = api.filter(function(repo) {
        return repo.id === difference[i];
      });

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

    // Wrap the array in an object
    const repos = { newRepos };

    // Now send the different repos to the post route to add to the db
    $.post('/api/repos', repos).then(function(data) {
      console.log('Data!!!!', data);

      // Put the response in an array
      currentRepos = data;

      // Call the function that displays the cards
      initializeRows();
    });
  }

  // Use Async/Await to get the repos from both the api and db
  // so they return at the same time so I can compare
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

      // Get just the API repo ids
      const apiIDs = api.map(getJustApiID);
      // console.log('Just the apiIDs:', apiIDs);

      // Get just the db repo ids
      const dbIDs = db.map(getJustDbID);
      // console.log('Just the dbIDs:', dbIDs);

      // Compare the arrays and get what's different
      const difference = apiIDs.filter(x => !dbIDs.includes(x));

      // console.log('Difference Array:', difference);
      // console.log(difference.length);

      // Call the route to insert the repos
      // Check if there are any new repos to add, if not, just call initializeRows
      if (difference.length !== 0) {
        insertRepo(difference, api);
      } else {
        $.get('/api/dbRepos', function(data) {
          currentRepos = data;
          initializeRows();
        });
      }
    } catch (e) {
      console.error(e); // 💩
    }
  }

  // This function grabs tags from the database and updates the view
  function getTags() {
    $.get('/api/tags', function(data) {
      tags = data;
      // console.log(tags);
      displayTags();
    });
  }

  // This function grabs all the repo tags
  function getRepoTags() {
    $.get('/api/repotags', function(data) {
      repoTags = data;
      console.log('Repo Tags', repoTags);
    });
  }

  // This function inserts a new todo into our database and then updates the view
  function insertTag(event) {
    console.log('Add Repo Tag Called');

    event.preventDefault();
    const tag = {
      repoID: 1,
      tagID: 1,
    };

    $.post('/api/repotags', tag, getAllRepos);
    // $newItemInput.val('');
  }

  // Call the async/await function to get the repos
  getAllRepos();

  // Call getTags to get tags on load
  getTags();

  // Call getReptTags to get all the repo tags on load
  getRepoTags();

  $(document).on('mousedown', 'button[rel=popover]', function() {
    console.log($('#tags').html());

    // const content = $('.container div:nth-child(2)');
    // const content = $('.container')
    // .find('div')
    // .attr('id', 'tags');

    const content2 = $('<button>REACT</button>');

    $(this)
      .popover({
        placement: 'top',
        container: 'body',
        html: true,
        title:
          'Choose a Tag <a href="#" class="close" data-dismiss="alert">&times;</a>',
        content: content2,
      })
      .click(function(e) {
        e.preventDefault();
      });
  });

  $(document).on('click', '.popover .close', function() {
    $(this)
      .parents('.popover')
      .popover('hide');
  });

  // $('[data-toggle="popover"]').popover({
  //   placement: 'top',
  //   html: true,
  //   selector: '[rel="popover"]',
  //   title:
  //     'Choose a Tag <a href="#" class="close" data-dismiss="alert">&times;</a>',
  //   content() {
  //     return '<a id="btnTemplate" class="btn btn-primary btn-sm" href="#" role="button">HTML</a><a id="btnCustom" class="btn btn-primary btn-sm" href="#" role="button">REACT</a>';
  //   },
  // });
  // $(document).on('click', '.popover .close', function() {
  //   $(this)
  //     .parents('.popover')
  //     .popover('hide');
  // });

  //! **********************************************

  // Our initial todos array
  // let todos = [];

  // Getting todos from database when page loads
  // getTodos();

  //! ********************************************

  // This function grabs todos from the database and updates the view
  // function getTodos() {
  //   $.get('/api/todos', function(data) {
  //     todos = data;
  //     initializeRows();
  //   });
  // }

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
