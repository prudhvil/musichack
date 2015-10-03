var bestPictures = new Bloodhound({

  remote: {
    url: 'http://svikram.ucsd.edu/api/get_song?name=%QUERY',
    wildcard: '%QUERY',
    ajax : {
      dataType: 'jsonp'
    },
  },
  identify: function(obj) { return obj.id },
  transform: function(obj) { return obj.results; },
  datumTokenizer: Bloodhound.tokenizers.whitespace,
  queryTokenizer: Bloodhound.tokenizers.whitespace
});

$('#tosong').typeahead(null, {
  name: 'song',
  display: 'name',
  source: bestPictures,
  templates : {
    suggestion: "<div>{{name}} - {{artist}}</div>"
  }
});