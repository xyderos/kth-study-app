$(document).ready(function () {
  $('#btnLoginUser').on('click', loginForm);
  $('#btnCreateGroup').on('click', createGroup);
  $('#btnDeleteGroup').on('click', deleteGroup);
  $('#btnJoinGroup').on('click', joinGroup);
  $('#btnCreateUser').on('click', createUser);
  $('#btnSignOut').on('click', signOut);
  $('#btnSendComment').on('click', comment);
  listGroups();
});

var userEmail = '';
console.log(userEmail);

function listGroups() {
  var groups = '';

  $.getJSON('/groups/list', function (data) {
    $.each(data, function() {
      groups += '<div id="single-group">';
      groups += '<a href="/groups/list/' + this._id + '" class="group-link">';
      groups += '<p> <b>Subject:</b> ' + this.subject + '</p>';
      groups += '<p> <b>Group Owner:</b> ' + this.owner + '</p>';
      groups += '<p> <b>Number of members:</b> ' + this.members.length + '</p>';
      groups += '<p> <b>Created:</b> ' + this.timeStamp + '</p>';
      groups += '<p> <b>Location:</b> ' + this.location + '</p>';
      groups += '</a>';
      groups += '</div>';
    });

    $('#groups').html(groups);
  });
}

function printLoginError(msg) {
  $('#errorMsg h2').html(msg);
}

function loginForm() {
  event.preventDefault();

  var loginUser = {
    'email' : $('#loginForm fieldset input#inputUserEmail').val(),
    'password' : $('#loginForm fieldset input#inputUserPassword').val()
  };

  $.ajax({
    type: 'POST',
    data: loginUser,
    url: '/login',
    dataType: 'JSON'
  }).done(function(response) {
      if (response.msg === 'success') {
        userEmail = loginUser;
        window.location = '/';
      } else {
        printLoginError(response.msg);
      }
  });
}

function createGroup() {
  event.preventDefault();

  var newGroup = {
    'subject' : $('#createGroup fieldset input#inputSubject').val(),
    'location' : $('#createGroup fieldset input#inputLocation').val(),
    'description' : $('#createGroup fieldset textarea#inputDescription').val()
  };

  $.ajax({
    type: 'POST',
    data: newGroup,
    url: '/groups/create',
    dataType: 'JSON'
  }).done(function(response) {
      if (response.msg === 'success') {
        window.location = '/groups/list/' + response.link;
      } else {
        printLoginError(response.msg);
      }
  });
}

function deleteGroup() {
  event.preventDefault();
  var groupId = location.href.substr(location.href.lastIndexOf('/') + 1);

  $.ajax({
    type: 'DELETE',
    url: '/groups/delete/' + groupId
  }).done(function(response) {
      if (response.msg === 'success') {
        window.alert('Group Deleted');
        window.location = '/';
      } else {
        window.alert('You do not have the permissions to delete this group');
      }
  })
}

function joinGroup() {
  event.preventDefault();
  var groupId = location.href.substr(location.href.lastIndexOf('/') + 1);

  $.ajax({
    type: 'POST',
    url: '/groups/join/' + groupId
  }).done(function(response) {
      if (response.msg === 'success') {
        console.log('asdf');
        window.alert('Joined Group');
        window.location = '/groups/list/' + groupId;
      } else {
        window.alert('You are already a member of this group');
      }
  })
}

function createUser() {
  event.preventDefault();

  var newUser = {
    'email' : $('#createUser fieldset input#inputNewEmail').val(),
    'password' : $('#createUser fieldset input#inputNewPassword').val()
  };

  $.ajax({
    type: 'POST',
    data: newUser,
    url: '/users/create',
    dataType: 'JSON'
  }).done(function(response) {
      if (response.msg === 'success') {
        window.location = '/login';
      } else {
        window.alert(response.msg);
      }
  });
}

function signOut() {
  event.preventDefault();

  $.ajax({
    type: 'POST',
    url: '/users/signout'
  }).done(function(response) {
      if (response.msg === 'success') {
        window.location = '/login';
      } else {
        printLoginError(response.msg);
      }
  });
}

function comment() {
  event.preventDefault();
  var groupId = location.href.substr(location.href.lastIndexOf('/') + 1);
  var msg = $('#commentForm form textarea#inputComment').val();
  var comment = {
    'msg' : msg
  };

  $.ajax({
    type: 'POST',
    data: comment,
    url: '/groups/comment/' + groupId
  }).done(function(response) {
      if (response.msg === 'success') {
        window.alert('Sent Comment');
        window.location = location.href;
      } else {
        window.alert(response.msg);
      }
  })
}
