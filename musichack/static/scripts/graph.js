var Graph = (function() {
    var apiUrl = 'http://svikram.ucsd.edu'; 

    var G, startId, endId, currId,nextId;
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
      console.log("Requesting neighbors for ", id)
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
        if (!G.hasEdge(id,nId)) G.addEdge(id,nId,{'width': 2, 'length': 100});

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
            tooltip.transition().duration(200).style('opacity', 0.9);

            console.log("<div>"+data.result.name+"<img src='"+data.result.artwork['100']+"'/></img></div>");
            tooltip.html("<div>"+data.result.name+"<img src='"+data.result.artwork['100']+"'/></img></div>").
            style("left", x+"px").style("top", y+"px");
            console.log(tooltip, x, y);

          }, onFailure);
        }).on("mouseout", function(d) {
          tooltip.transition().duration(200).style('opacity', 0);
        }).on("click", function(d) {
          console.log("Requesting neighbors of ", d.node)
          requestNeighbors(d.node);
        });
    }

    var graphNext = function(nextId) {
      G.addNode(nextId,{'fill': '#00CC00', 'radius': 10, 'id': nextId});
      addTipsy(nextId);
      G.addEdge(currId,nextId,{'width': 6, 'length': 100});
      currId = nextId;
      if (currId != endId) requestNext();
    }

    var start = function() {
        G = new jsnx.Graph()
        startId = 185890;
        endId = 198986;
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
                  }
          }
        }, true);


        G.addNode(startId,{'fill': '#00CC00', 'radius': 10, 'id': startId});
        d3.select("[nodeid='"+startId+"']").each(function(d) {d.fixed = true});
        addTipsy(startId);
        //G.addNode(endId,{'fill': '#00CC00'});

        requestNext();
    };
    
    return {
        start: start
    };
    
})();