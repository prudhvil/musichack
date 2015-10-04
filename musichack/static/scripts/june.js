$(document).ready(function() {

  var fromSong, toSong;
  var songs = []
  function unhideTo() {
    $("#to").fadeIn(300, function() {
      $("#tosong").focus();
    });
  }

  function loadYoutube(songs) {
    // Load the IFrame Player API code asynchronously.
    youtubeIds = songs.map(function(s) {return s.youtube});
    $("#youtubeplayer").html('<iframe width="100%" src="http://www.youtube.com/embed/'+youtubeIds[0]+'?autoplay=1&playlist='+youtubeIds.slice(1).join(',')+'" frameborder="0" allowfullscreen></iframe>')
  }

  var songs = []

  var clearSongs = function() {
    songs.splice(0, songs.length);
  }

  var getId = function(id, youtube, cb) {
    youtube = youtube || false;
    $.ajax('/api/get_id', {
      dataType: 'jsonp',
      data: {
        id: id,
        youtube: youtube
      }
    }).done(function(data) {
      cb(data.result);
    })
  }

  var addSongToPlaylist = function(id, cb) {
    getId(id, true, function(song) {
      songs.push(song);
      artwork = song.artwork['100'];
      if (!artwork) {
        artwork = "/img/no_album_art.png";
      }
      var elem = $("<div></div>").loadTemplate($("#playlisttemplate"), {
        name: song.name,
        artist: song.artist,
        artwork: artwork,
        youtube: "http://www.youtube.com/watch?v="+song.youtube,
      });
      $('#playlist').append(elem);
      cb();
    });
  }


  function scrollDown() {
    $("div#second").removeClass("hidden");
    $("a#logo").removeClass("hidden");
    $("div#graph").removeClass("hidden");
    $("div#sidebar").removeClass("hidden");
    window.location = "#second";

    $("div#first").addClass("hidden");
    $("div#fakeNav").removeClass("hidden");


    $("div#to").detach().prependTo('#second');
    $("div#from").detach().prependTo('#second');


  }

  $('#fromsong').bind('typeahead:autocompleted typeahead:selected', function(obj, datum, name) {
    fromSong = datum;
    unhideTo();
  });

  var loadAdventureGraph = function(start, end) {
    $("#graph-header").text("travel");
    $("#graph-header").removeClass("explore");
    $("#graph-header").addClass("travel");
    $("#first").hide()
    $("#second").show()
    var finished = false;
    Graph.start({id:start}, {id:end}, function(songId) {
      addSongToPlaylist(songId, function() {
        if (finished) {
          loadYoutube(songs);
        }
      });
    }, function() {
      finished = true;
    }, function(songId) {
      $.getJSON("/api/get_id?callback=?&youtube=true&id="+songId, {}, function(data) {
        loadYoutube([data.result])
      })
    });
  }

  $('#tosong').bind('typeahead:autocompleted typeahead:selected', function(obj, datum, name) {
    toSong = datum;
    //scrollDown();

    loadAdventureGraph(fromSong.id, toSong.id);
  });

  //loadAdventureGraph(3, 5);
});
