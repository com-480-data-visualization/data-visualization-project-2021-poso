// need to reposition graphe whenever viewport changes
var topPos = document.getElementById('cy_container').offsetTop;
document.getElementById('cy').style.marginTop = topPos + "px";
document.addEventListener('keydown', function(event) {
    // full screen
    if(event.keyCode == 122) {
        location.reload();
    }
});

Promise.all([
  fetch('data/cy-style.json', {mode: 'no-cors'})
    .then(function(res) {
      return res.json()
    }),
  fetch('data/new_data.json', {mode: 'no-cors'})
    .then(function(res) {
      return res.json()
    })
])
  .then(function(dataArray) {
    var cy = window.cy = cytoscape({
      container: document.getElementById('cy'),

      layout: {
        name: 'cose',
        idealEdgeLength: 100,
        nodeOverlap: 20,
        refresh: 20,
        fit: true,
        padding: 10,
        randomize: false,
        componentSpacing: 100,
        nodeRepulsion: 400000,
        edgeElasticity: 100,
        nestingFactor: 5,
        gravity: 80,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.95,
        minTemp: 1.0
      },

      style: dataArray[0],

      elements: dataArray[1],

      // interaction options :
      userZoomingEnabled:false,
      userPanningEnabled:false
    });
  });
