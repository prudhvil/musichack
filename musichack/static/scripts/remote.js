var bestPictures = new Bloodhound({

  remote: {
    url: 'http://svikram.ucsd.edu/api/get_song?name=%QUERY',
    wildcard: '%QUERY',
    ajax : {
      dataType: 'jsonp'
    },
    transform: function(obj) { return obj.result; },
  },
  identify: function(obj) { return obj.id },
  datumTokenizer: Bloodhound.tokenizers.whitespace,
  queryTokenizer: Bloodhound.tokenizers.whitespace
});

$('#tosong').typeahead(null, {
  name: 'tosong',
  display: 'name',
  source: bestPictures,
  display: function(obj) { return obj.name +" - " + obj.artist},
  //templates : {
    //suggestion: function(obj) { console.log(obj); return "<div>" + obj.name +" - " + obj.artist + "</div>"}
  //}
});
$('#fromsong').typeahead(null, {
  name: 'fromsong',
  display: 'name',
  source: bestPictures,
  display: function(obj) { return obj.name +" - " + obj.artist},
  //templates : {
    //suggestion: function(obj) { console.log(obj); return "<div>" + obj.name +" - " + obj.artist + "</div>"}
  //}
});
