// need to reposition graphe whenever viewport changes
var topPos = document.getElementById('cy_container').offsetTop;
document.getElementById('cy').style.marginTop = topPos + "px";
document.addEventListener('keydown', function(event) {
    // full screen
    if(event.keyCode == 122) {
        location.reload();
    }
});

// fetch data and launch
var cy;
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
    cy = window.cy = cytoscape({
      container: document.getElementById('cy'),

      layout: {
        name: 'cose',
        idealEdgeLength: 100,
        avoidOverlap: true,
        nodeOverlap: 200,
        refresh: 20,
        fit: true,
        padding: 10,
        randomize: true,
        componentSpacing: 100,
        nodeRepulsion: 100000,
        edgeElasticity: 32,
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

    cy.ready(function() {
      cy.nodes().forEach(function(ele) {
        makePopper(ele);
      });
    });

    cy.nodes().unbind('mouseover');
    cy.nodes().bind('mouseover', (event) => event.target.tippy.show());

    cy.nodes().unbind('mouseout');
    cy.nodes().bind('mouseout', (event) => event.target.tippy.hide());
  });

  function makePopper(ele) {
     let ref = ele.popperRef(); // used only for positioning

     ele.tippy = tippy(ref, { // tippy options:
       content: () => {
         let content = document.createElement('div');

         content.innerHTML = ele.data("name");

         return content;
       },
       trigger: 'manual' // probably want manual mode
     });
   }
