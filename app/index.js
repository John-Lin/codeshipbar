$(document).ready(function() {
  var cs = require('./lib/codeship.js');
  var utils = require('./lib/utils.js');
  var ipc = require('ipc');

  // var DateRange = require('moment-range');
  // var moment = require('moment');

  var quitBtn = $('#quit-btn');
  var settingBtn = $('#setting-btn');
  var refreshBtn = $('#refresh-btn');
  var projectSelect = $('#project-select');

  // function getBuildStatus(status) {
  //   var greenHtml = '<span class="icon icon-record" style="color:#34c84a">';
  //   var redHtml = '<span class="icon icon-record" style="color:#fc605b">';
  //   var successBtn = '<button class="btn btn-mini btn-positive">' + status.toUpperCase() + '</button>';
  //   var failedBtn = '<button class="btn btn-mini btn-negative">' + status.toUpperCase() + '</button>';
  //   var twoSpace = '&nbsp;&nbsp;';
  //   var closedSpanHtml = '</span>';
  //
  //   if (status === 'success') {
  //     var html = greenHtml + twoSpace + closedSpanHtml + status.toUpperCase();
  //     return html;
  //   } else if (status === 'error') {
  //     var html = redHtml + twoSpace + closedSpanHtml + status.toUpperCase();
  //     return html;
  //   }
  //
  // }

  function addBuildHistory(branch, username, message, commitId, status, started, finished) {
    var brIconHtml = '<span class="icon icon-flow-branch">';
    var flowIconHtml = '<span class="icon icon-shareable">';
    var commentIconHtml = '<span class="icon icon-comment">';
    var userIconHtml = '<span class="icon icon-user">';
    var twoSpace = '&nbsp;&nbsp;';
    var closedSpanHtml = '</span>';

    // var dr = moment.range(moment.utc(started), moment.utc(finished));
    // console.log(dr.diff());

    if (status === 'success') {
      var imgSrc = '../dist/img/success.png';
    } else if (status === 'error') {
      var imgSrc = '../dist/img/fail.png';
    }

    $('.window-content ul').append(
          $('<li>')
            .attr('class', 'list-group-item').append(
              $('<img>')
                .attr('class', 'img-circle media-object pull-left')
                .attr('src', imgSrc)
                .attr('width', '32')
                .attr('height', '32').append(
    )).append(
      $('<div>')
        .attr('class', 'media-body').append(
        $('<strong>').append(userIconHtml + twoSpace + username + closedSpanHtml)
    ).append(
      $('<p>').append(brIconHtml + twoSpace + branch + closedSpanHtml)
    ).append(
      $('<p>').append(commentIconHtml + twoSpace + message + closedSpanHtml)
    ).append(
      $('<p>').append(flowIconHtml + twoSpace + commitId.slice(0, 8) + closedSpanHtml)
    )));

    // $('.window-content ul').append(
    //       $('<li>')
    //         .attr('class', 'list-group-item').append(
    //           $('<img>')
    //             .attr('class', 'img-circle media-object pull-left')
    //             .attr('src', imgSrc)
    //             .attr('width', '32')
    //             .attr('height', '32').append(
    // )).append(
    //   $('<div>')
    //     .attr('class', 'media-body').append(
    //     $('<strong>').append(username)
    // ).append(
    //   $('<p>').append(brIconHtml + '&nbsp;&nbsp;' + branch + closedSpanHtml)
    // ).append(
    //   $('<p>').append(message)
    // ).append(
    //   $('<p>').append(flowIconHtml + '&nbsp;&nbsp;' + commitId.slice(0, 8) + closedSpanHtml)
    // ).append(
    //   $('<p>').append(getBuildStatus(status))
    // )));
  }

  function updateProjectList() {
    cs.getProjectList(function(err, project) {
      for (var i = 0; i < project.length; i++) {
        projectSelect.append($('<option>', {
          value: project[i].id,
          text: project[i].repoName,
        }));

      }
    });
  }

  function updateBuildHistory(projectID) {
    $('.list-group-item').remove();
    if (projectID === 'Select project') {
      return;
    }

    cs.getBuildHistory(projectID, (err, res) => {
      for (var i = 0; i < res.length; i++) {
        addBuildHistory(
          res[i].branch,
          res[i].github_username,
          res[i].message,
          res[i].commit_id,
          res[i].status,
          res[i].started_at,
          res[i].finished_at
        );
      }
    });
  }

  function inputApiKey() {
    swal({
      title: 'API Key',
      text: 'You can get your API key on your account page.',
      type: 'input',
      showCancelButton: true,
      closeOnConfirm: false,
      animation: 'slide-from-top',
      inputPlaceholder: 'API Key',
    }, function(inputValue) {
      if (inputValue === false) return false;
      if (inputValue === '') {
        swal.showInputError('The input is empty!');
        return false;
      }

      utils.setAPIKey(inputValue);
      location.reload();
    });
  }

  quitBtn.click(function() {
    ipc.send('terminate');
  });

  settingBtn.click(function() {
    inputApiKey();
  });

  refreshBtn.click(function() {
    updateBuildHistory(projectSelect.val());
  });

  if (utils.loadAPIKey()) {
    updateProjectList();
    projectSelect.on('change', function() {
      updateBuildHistory(this.value);
    });

  } else {
    inputApiKey();
  }

});
