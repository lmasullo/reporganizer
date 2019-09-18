$(document).ready(function() {
  // Adding event listeners for deleting, editing, and adding todos
  $(document).on('click', 'button.delete', deleteTodo);
  $(document).on('click', 'button.complete', toggleComplete);
  $(document).on('click', '.todo-item', editTodo);
  $(document).on('keyup', '.todo-item', finishEdit);
  $(document).on('blur', '.todo-item', cancelEdit);
  $(document).on('submit', '#todo-form', insertTodo);

  //! *************************************

  // The initial repos array
  let currentRepos = [];

  // The initial tags array
  let tags = [];

  // The initial repo tags array
  let repoTags = [];

  // Initial repoID, used when click on Add Tag, this is the mysql integer id, not the GitHub string id
  let repoID = 0;

  // Initial array to hold the filtered repo tags for each repo
  // const arrFilteredTags = [];

  // This function displays repos from the database
  function initializeRows() {
    console.log('In Initialize Rows');

    console.log('Repo Tags', repoTags);

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

      // const btnID = `btnAddRepoTag${i}`;
      // id="${btnID}"
      // rel='popover'
      // data-toggle="popover"
      // btnAdd
      // data-content="Content"

      // const allTags = $('<div>');
      // Looping over each repo, filter the repoTags array to just the tags associate with this repoID
      // repoTags.filter;

      // Get the matching repo tags for this repo
      // console.log(currentRepos[i].id);

      const matchingTags = getRepoTags(repoTags, currentRepos[i].id);
      // console.log('Match', matchingTags);
      // console.log(matchingTags.length);

      if (matchingTags.length > 0) {
        console.log('Match', matchingTags);
        // console.log(matchingTags[0].tagName);

        for (let i = 0; i < matchingTags.length; i++) {
          // Now build the div to hold the tags
          // const divAssocTags = $('<div>');
          const btnAssocTag = $('<button>');
          btnAssocTag.addClass('btn btn-sm');
          btnAssocTag.css('background-color', matchingTags[i].tagColor);
          btnAssocTag.text(matchingTags[i].tagName);
          // divAssocTags.append(btnAssocTag);
          divCardBody.append(btnAssocTag);
        }
        const hr = $('<hr>');
        divCardBody.append(hr);
      }

      // Use an arrow function
      // const filteredTags = repoTags.filter(tag => {
      //   if (tag.repoID === currentRepos.id) {
      //     return true;
      //   }
      // });

      // const filteredTags = repoTags.filter(
      //   tag => tag.repoID === currentRepos.id
      // );

      const cardTags = $('<div>');
      const btnAddTag = $(
        `<button id="${currentRepos[i].id}" type="button" class="btn btn-success btn-sm btnAdd" rel="popover" title="Add a Tag to ${currentRepos[i].repoName} <a href='#' class='close' data-dismiss='alert'>&times;</a>"
        >Add Tag</button>`
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

      const popTag = $('<button>');
      popTag.addClass('btn btn-sm popTag');
      popTag.css('background-color', tags[i].tagColor);
      popTag.attr('id', tags[i].id);
      popTag.text(tags[i].tagName);

      // Append to the tags div
      $('#tags').append(btnTag);

      // Append to the popTags div
      $('#popTags').append(popTag);
    }
  }

  //! ***************************
  // todo ***************************
  // function displayRepoTags() {
  //   console.log('In display Repo tags');

  //   // Loop over the db tags
  //   for (let i = 0; i < repoTags.length; i++) {
  //     // console.log(tags[i].tagName);

  //     const btnRepoTag = $('<button>');
  //     btnRepoTag.addClass('btn btn-sm');
  //     btnRepoTag.css('background-color', repoTags[i].tagColor);
  //     btnRepoTag.text(repoTags[i].tagName);

  //     // Append to the tags div
  //     // let repoID = repoTags[i]repoID;
  //     // $("#"+repoID).append(btnRepoTag);
  //   }
  // }

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

      // repo Tags repos
      const dbRepoTagsPromise = $.get('/api/dbRepoTags');

      // Wait for both to resolve
      const [api, db, dbRepoTags] = await Promise.all([
        repoPromise,
        dbRepoPromise,
        dbRepoTagsPromise,
      ]);
      console.log('API:', api);
      console.log('DB:', db);
      console.log('RepoTags:', dbRepoTags);

      repoTags = dbRepoTags;

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
      // Display the tags on the page
      displayTags();
    });
  }

  //! ??????????????????????????????
  // This function grabs all the repo tags, being called from within initializeRows, #57
  function getRepoTags(repoTags, repoID) {
    // console.log('repo ID as a param', repoID);

    // console.log(repoTags);
    // console.log(repoID);

    // arrFilteredTags = [];
    let arrFilteredTags = [];

    // console.log(typeof repoID);

    // todo change Repo Tags repoID to integer
    // strRepoID = toString(repoID);

    // Filter the tags
    const filteredRepoTags = repoTags.filter(tag => tag.repoID == repoID);
    // console.log('Filtered Repo Tags', filteredRepoTags);

    // Get route to get the repo tags associated with each repo
    // $.get(`/api/repotags/${repoID}`, function(data) {
    // repoTags = data;
    // Display the repo tags for each card
    // return repoTags;
    // console.log('Repo Tags', repoTags);

    // Now get the tag info and display
    // loop over the repo tags and find the matches
    // New array for the results

    // console.log('Tags:', tags);

    // Filter the tags to each repo tag to get the info to display
    function filterTags(repoTagID) {
      // Covert to integer
      const intTagID = parseInt(repoTagID);
      // console.log('int tag', intTagID);

      // console.log('Tags', tags);

      // Filter the tags
      const filteredTags = tags.filter(tag => tag.id === intTagID);
      // console.log('Filtered', filteredTags);

      return filteredTags;
    }

    // Loop through the repo tags and get the matching tags
    for (let i = 0; i < filteredRepoTags.length; i++) {
      // Call the filter function
      // console.log(repoTags[i].tagID);

      const getFiltered = filterTags(filteredRepoTags[i].tagID);
      // console.log(getFiltered);

      arrFilteredTags = [...arrFilteredTags, ...getFiltered];
      // console.log(arrFilteredTags);
    }

    // console.log('Filtered Tags:', arrFilteredTags);
    // });
    // console.log('Filtered Tags2:', arrFilteredTags);
    return arrFilteredTags;
  }

  // This function inserts a new tag into our database and then updates the view
  function insertTag(repoID, tagID) {
    console.log('Add Repo Tag Called');

    // event.preventDefault();
    const tag = {
      repoID,
      tagID,
    };

    // getAllRepos

    // Send the tag to route to be inserted
    $.post('/api/repotags', tag, getAllRepos);

    // Close the popover
    $('.popover').hide();
  }

  // Call the async/await function to get the repos
  getAllRepos();

  // Call getTags to get tags on load
  getTags();

  // Call getReptTags to get all the repo tags on load
  // getRepoTags();

  // Tag Popover options
  const popOverSettings = {
    placement: 'auto',
    container: 'body',
    html: true,
    selector: '[rel="popover"]',
    content: $('#popTags'),
  };

  // Loads the popover options
  $('body').popover(popOverSettings);

  // Closes the popover when user clicks on the X
  $(document).on('click', '.popover .close', function(e) {
    e.preventDefault();
    $(this)
      .parents('.popover')
      .popover('hide');
  });

  // Add Tag Button Clicked
  $(document).on('click', '.btnAdd', function() {
    console.log('btnAdd clicked');
    repoID = $(this).attr('id');
    console.log('Add Tag Click with repo ID', repoID);
  });

  // Popover Tag clicked
  $(document).on('click', '.popTag', function(e) {
    e.preventDefault();
    console.log('Pop Tag clicked');

    // Get the tagID
    const tagID = $(this).attr('id');
    console.log(tagID);

    // Get the repoID, set when click on Add Tag
    console.log(repoID);

    // Call insertTag to save this tag
    insertTag(repoID, tagID);
  });

  //! **********************************************

  // Our initial todos array
  // let todos = [];

  // Getting todos from database when page loads
  // getTodos();

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
