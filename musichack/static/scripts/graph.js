var Graph = (function() {
    var apiUrl = 'http://svikram.ucsd.edu';

    var G, startId, endId, currId,nextId;
    var onEnd;
    var onSong;
    var tooltip;
    var delay = 100;

    var makeGetRequest = function(url, onSuccess, onFailure) {
       $.ajax({
           type: 'GET',
           url: apiUrl + url,
           jsonp: "callback",
           dataType: "jsonp",
           success: onSuccess,
           error: onFailure
       });
    };

    var fixNode = function(id) {
        d3.select("[nodeid='"+id+"']").each(function(d) {
          d.fixed = true;
        }) ;
    }

    var makePostRequest = function(url, data, onSuccess, onFailure) {
        $.ajax({
            type: 'POST',
            url: apiUrl + url,
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: onSuccess,
            error: onFailure
        });
    };

    var requestNext = function() {
        makeGetRequest('/api/get_next?current_id='+currId+'&end_id='+endId+'&k=3',onNextReceived,onFailure);
        //makeGetRequest('/api/get_neighbors?id='+currId+'&k=4',onNeighborsReceived,onFailure);
    }

    var requestNeighbors = function(id) {
        makeGetRequest('/api/get_neighbors?id='+id+'&k=3', function(data) {
            graphNeighbors(id, data.result)
        }, onFailure)
    }

    var onNextReceived = function(data) {
        if (nextId) {
          currId = nextId;
        }
        nextId = data.result.next_id;
        graphNeighbors(currId, data.result.neighbors);
        setTimeout(function() { graphNext(nextId)}, delay * 5);
    }

    var onFailure = function() {
          console.error('error fetching songs');
    }
    var graphNeighbors = function(id, neighbors) {
      var neighborsHelper = function() {
        var nId = neighbors.pop();
        if (!G.hasNode(nId)) {
          G.addNode(nId,{'fill': '#999', 'radius': 5, 'id': nId});
          addTipsy(nId);
        }
        if (!G.hasEdge(id,nId)) G.addEdge(id,nId,{'width': 2, 'length': 100, 'color':'white'});

        if (Math.random() > 0.7) {
          requestNeighbors(nId);
        }

        if(neighbors.length != 0)  {
          setTimeout(neighborsHelper, delay);
        }
      }

      setTimeout(neighborsHelper, delay);
    }

    var addTipsy = function(nodeId) {
        d3.select("[nodeid='"+nodeId+"']").on("mouseover", function(d) {
          var x = d3.event.pageX, y = d3.event.pageY;
          makeGetRequest('/api/get_id?id='+nodeId, function(data) {
            var tooltip = $("<div></div>")
            tooltip.transition().duration(200).style('opacity', 0.9);

            tooltip.html("<div>"+data.result.name+"<img src='"+data.result.artwork['100']+"'/></img></div>").
            style("left", x+"px").style("top", y+"px");

          }, onFailure);
        }).on("mouseout", function(d) {
          tooltip.transition().duration(200).style('opacity', 0);
        }).on("click", function(d) {
          d3.select(this).style('fill', '#ffe792');
          fixNode(d.node.id);
          requestNeighbors(d.node);
        });
    }

    var graphNext = function(nextId) {
      onSong(nextId);
      if (nextId == endId) {
        color = '#f92672'
        size=20;
      } else {
        color = '#66d9ef'
        size=15;
      }
      G.addNode(nextId,{'fill': color, 'radius': size, 'id': nextId});
      addTipsy(nextId);
      G.addEdge(currId,nextId,{'width': 6, 'length': 100, 'color':'white'});
      currId = nextId;
      if (currId != endId) {
        requestNext();
      } else {
        onEnd();
      }
    }

    var start = function(start, end, cb, endCb) {
        onSong = cb;
        onEnd = endCb;
        startId = start.id;
        endId = end.id;
        G = new jsnx.Graph()
        currId = startId;
        tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);


        jsnx.draw(G, {
          element: '#canvas',
          weighted: false,
          withLabels: false,
          nodeStyle: {
            'fill': function(d) {
                    return d.data.fill;
                  },
            'r': function(d) {
                    return d.data.radius;
                  }
          },
          nodeAttr: {
            'nodeid': function(d) {
                    return d.data.id;
                  },
            'mouseover': function(d) {
                    return d.data.mouseover;
                  },
          },
          edgeStyle: {
            'stroke-width': function(d) {
                    return d.data.width;
                  },
            'stroke-length': function(d) {
                    return d.data.length;
                  },
            'fill': function(d) {
                    return d.data.color;
                  }
          }
        }, true);


        G.addNode(startId,{'radius': 20, 'id': startId, 'fill': '#a6e22e'});
        onSong(startId);
        d3.select("[nodeid='"+startId+"']").each(function(d) {
          d.fixed = true;
          d.x = 0;
          d.y = 0;
        }) ;
        addTipsy(startId);

        requestNext();
    };

    return {
        start: start
    };

})();
