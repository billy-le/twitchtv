var list = (function() {

  var usersList = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "imaqtpie", "brunofin", "comster404"];

  return {
    check: usersList,
    getList: usersList.toString(),
    addUser: function(user) {
      usersList.push(user);
    },
    removeUser: function(user) {
      usersList.splice(usersList.indexOf(user), 1);
    }
  }
})();

var ajax = (function() {

  // private XMLHttpRequest method
  var req = function(method, url, value, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url + value);
    xhr.onload = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var obj = JSON.parse(xhr.responseText);
        return callback(obj, value);
      }
    }
    xhr.send();
  }

  return {
    getReq: req
  }
})();

var getStatus = (function() {
  function element(name, attribute, value) {
    var el = document.createElement(name);
    el.setAttribute(attribute, value);
    return el;
  }

  function createListItem(id, name, channelInfo){
    //cache the DOM
    var listId = document.getElementById('list-container'),
      //create elements
      li = element('li', 'class', 'list-item'),
      divLayout = element('div', 'class', 'list-layout'),
      divTitle = element('div', 'class', 'stream-title'),
      divId = element('div', 'class', 'preview'),
      divInfo = element('div', 'class', 'stream-info-container');

    divId.id = id;
    divTitle.id = name;
    divInfo.id = channelInfo;

    divLayout.appendChild(divId);
    divLayout.appendChild(divInfo);
    li.appendChild(divTitle);
    li.appendChild(divLayout);
    listId.appendChild(li);
  }

  var online = function(data, value) {
    //cache data
    if (data.stream !== null) {
      var displayName = data.stream.channel.display_name,
        streamId = data.stream._id,
        channelId = data.stream.channel._id,
        game = data.stream.game,
        status = data.stream.channel.status,
        viewerCount = data.stream.viewers,
        totalViews = data.stream.channel.views,
        totalFollowers = data.stream.channel.followers;

      createListItem(streamId, displayName, channelId);

      var streamTitle = document.getElementById(displayName),
        streamInfo = document.getElementById(channelId);

      streamTitle.className += ' live';
      streamInfo.className += ' live-shade';

      streamTitle.innerHTML = '<h2>' + displayName + '</h2>';
      streamInfo.innerHTML = '<h3>Streaming:</h3> <p>' + game + ' - ' + status + '</p><p>Viewers:  ' + viewerCount + '</p><p>Total Views: ' + totalViews + '</p><p>Total Followers: ' + totalFollowers + '</p>';

      var options = {
          width: 320,
          height: 180,
          channel: displayName,
          autoplay: "false"
        },
        player = new Twitch.Player(streamId.toString(), options);
      player.setVolume(0.5);
    }
    else {
      var newUrl = "https://wind-bow.gomix.me/twitch-api/channels/";
      ajax.getReq('GET', newUrl, value, getStatus.channel);
    }
  }

  var offline = function(data, value) {
    if (!data.hasOwnProperty('error')) {
      var displayName = data.display_name,
        channelId = data._id,
        url = data.url,
        totalViews = data.views,
        totalFollowers = data.followers,
        lastStream = data.updated_at;

      createListItem(value + '-id', displayName, channelId);

      var channelTitle = document.getElementById(displayName),
        channelImg = document.getElementById(value + '-id'),
        channelInfo = document.getElementById(channelId);

      channelTitle.innerHTML = '<h2>' + displayName + '</h2>';
      channelImg.innerHTML = '<img src="assets/images/Glitch_Purple_RGB.png" alt="' + displayName + '-image-placeholder" class="image-placeholder">';
      channelInfo.innerHTML = '<h3>Offline</h3><p>Total Views: ' + totalViews + '</p><p>Total Followers: ' + totalFollowers + '</p><a href="' + url + '"><p>Go to Twitch.tv</p></a>';
    }
    else {
      var displayName = value,
        valueId = value + '-id',
        valueInfo = value + '-info',
        errorRequest = data.error,
        errorStatus = data.status,
        errorMsg = data.message;

      createListItem(valueId, value, valueInfo);

      var notFoundId = document.getElementById(displayName),
        notFoundInfo = document.getElementById(valueInfo);

      notFoundId.className += ' not-found';
      notFoundInfo.className += ' not-found-shade';

      notFoundId.innerHTML = '<h2>' + displayName + '</h2>';
      notFoundInfo.innerHTML = '<h3>' + errorRequest + '</h3><p>Error ' + errorStatus + " - " + errorMsg + '</p>';
    }
  }

  return {
    check: online,
    channel: offline
  }
})();

var url = 'https://wind-bow.gomix.me/twitch-api/streams/';

list.check.forEach(function(channel) {
  ajax.getReq('GET', url, channel, getStatus.check)
})
