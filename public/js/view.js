
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

      // Remove all the elements and then rebuild so we can see the new repotags
      $('.card').remove();

      divCard.css('width', '15rem');

      const cardImg = $('<img>');
      cardImg.addClass('card-img-top');
      cardImg.attr('src', '../images/react.png');

      const divCardBody = $('<div>');

      divCardBody.addClass('card-body');

      const matchingTags = getRepoTags(repoTags, currentRepos[i].id);
      // console.log('Match', matchingTags);
      // console.log(matchingTags.length);
      console.log('Start Building Repo Tags list');

      if (matchingTags.length > 0) {
        // console.log('Match', matchingTags);
        // console.log(matchingTags[0].tagName);
        // console.log('Match', currentRepos[i].id);

        // Remove all the elements and then rebuild so we can see the new repotags
        // $('.btnRepoTags').remove();
        // Delete the button from the div
        // const buttonToDel = $('.btnRepoTags[data-id="3"]');
        // buttonToDel.remove();
        // console.log('Btn', buttonToDel);

        for (let i = 0; i < matchingTags.length; i++) {
          // Now build the div to hold the tags
          // const divAssocTags = $('<div>');

          const btnAssocTag = $('<button>');
          btnAssocTag.addClass('btn btn-sm btnRepoTags');
          btnAssocTag.css('background-color', matchingTags[i].tagColor);
          btnAssocTag.text(matchingTags[i].tagName);
          btnAssocTag.attr('data-id', matchingTags[i].id);
          // divAssocTags.append(btnAssocTag);
          divCardBody.append(btnAssocTag);
        }
        const hr = $('<hr>');
        divCardBody.append(hr);

        // Delete the button from the div
        // const buttonToDel = $('.btnRepoTags[data-id="3"]');
        // console.log('Btn', buttonToDel);
      }

      const cardTags = $('<div>');
      const btnAssignTag = $(
        `<button id="${currentRepos[i].id}" type="button" class="btn btn-success btn-sm btnAssign" rel="popover" title="Add a Tag to ${currentRepos[i].repoName} <a href='#' class='close' data-dismiss='alert'>&times;</a>"
        >Assign Tag</button>`
      );

      cardTags.append(btnAssignTag);

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
      btnTag.addClass('btn btn-sm tag');
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
    } // End display tags

    // Pipe ascii
    const pipe = String.fromCharCode(124);

    // Append pipe after last tag
    $('#tags').append(pipe);

    // Create Add Tag Button
    const btnAddTag = $('<button>');
    btnAddTag.text('Add Tag');
    btnAddTag.addClass('btn btn-sm btn-success btnAdd');

    // Append Add Tag Button
    $('#tags').append(btnAddTag);
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

      // Empty the tag div and then rebuild so we can see the new tags
      $('#tags').empty();

      // Display the tags on the page
      displayTags();
    });
  }

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

    // Send the tag to route to be inserted
    $.post('/api/repotags', tag, getAllRepos).then(function(data) {
      console.log('From Post Repo Tags ', data);

      // Put the response in an array
      // currentRepos = data;

      // Call the function that displays the cards
      // initializeRows();
    });

    // Close the popover
    $('.popover').hide();
  }

  // Call the async/await function to get the repos
  getAllRepos();

  // Call getTags to get tags on load
  getTags();

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

  // Assign Tag Button Clicked
  $(document).on('click', '.btnAssign', function() {
    console.log('btnAssign clicked');
    repoID = $(this).attr('id');
    console.log('Assign Tag Click with repo ID', repoID);
  });

  // Add Tag Button Clicked
  $(document).on('click', '.btnAdd', function(e) {
    console.log('btnAdd clicked');
    // repoID = $(this).attr('id');
    e.preventDefault();
    console.log('Add Tag Click');
    const tag = prompt('Please enter a new Tag Name');
    if (tag != null) {
      console.log(tag);

      const objTag = {
        tagName: tag.trim(),
        tagColor: '#00FFFF',
      };

      // Send value to the post route to add the tag to the db
      // Send the tag to route to be inserted
      $.post('/api/tag', objTag).then(function(data) {
        console.log(data);

        // Call the getTags function to display the new tag
        getTags();
      });
    }
  });

  // Popover Tag clicked to Assign
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

  // todo !!!!!!!!!!!!!!!!!!!!!!!!!!!
  // Repo Tag clicked to Delete
  $(document).on('click', '.btnRepoTags', function(e) {
    e.preventDefault();
    console.log('Repo Tag clicked');
    console.log($(this).attr('data-id'));

    // Get the tagID
    const tagID = $(this).attr('data-id');
    // console.log(tagID);

    $.ajax({
      method: 'DELETE',
      url: `/api/repotags/${tagID}`,
    }).then(function(dbRepoTags) {
      console.log('Response from delete', dbRepoTags);

      console.log('Now call Initialize rows');
      // Call the function to build the cards
      // initializeRows();

      // Call getAllRepos to remove the deleted repo tag
      getAllRepos();
    });

    // // Get the repoID, set when click on Add Tag
    // console.log(repoID);

    // // Call insertTag to save this tag
    // insertTag(repoID, tagID);
  });

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
