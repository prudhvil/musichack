var fromSong, toSong;
var songs = []
function unhideTo() {
  $("#to").fadeIn(300, function() {
    $("#to").focus();
  });
}

function displayYoutube() {
  // Load the IFrame Player API code asynchronously.
  youtubeIds = songs.map(function(s) {return s.youtube});
  console.log(youtubeIds);
  $("#ytplayer").html('<iframe width="100%" src="http://www.youtube.com/embed/'+youtubeIds[0]+'?autoplay=1&playlist='+youtubeIds.slice(1).join(',')+'" frameborder="0" allowfullscreen></iframe>')
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

$('#from').bind('typeahead:autocompleted typeahead:selected', function(obj, datum, name) {
  fromSong = datum;
  unhideTo();
});

$('#to').bind('typeahead:autocompleted typeahead:selected', function(obj, datum, name) {
  var finished = false;
  toSong = datum;
  scrollDown();

  // TODO: make graph query
  Graph.start(fromSong, toSong, function(songId) {
    $.getJSON("http://svikram.ucsd.edu/api/get_id?callback=?&id="+songId, {}, function(data) {
      songs.push(data.result);
      var html = '<div class="playlistSong row"><a href="http://www.youtube.com/watch?v='+data.result.youtube+'"><div class="col-lg-5"><img src="'+data.result.artwork['60']+'" height="80"> </div> <div class="col-lg-7"> <div class="songtitle">'+data.result.name+'</div> <div class="songartist">'+data.result.artist+'</div> </div></a></div>"';
      $("#sidebar").append(html);
      if (finished) {
         displayYoutube();
      }
     })
  }, function() {
    finished = true;
  });
});
