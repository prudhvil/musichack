var fromSong, toSong;
function unhideTo() {
  $("#to").fadeIn(300, function() {
    $("#to").focus();
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

    $("div#from").detach().appendTo('#second');
    $("div#to").detach().appendTo('#second');

}

$('#from').bind('typeahead:autocompleted typeahead:selected', function(obj, datum, name) {
  fromSong = datum;
  unhideTo();
});

$('#to').bind('typeahead:autocompleted typeahead:selected', function(obj, datum, name) {
  toSong = datum;
  scrollDown();

  // TODO: make graph query
});
