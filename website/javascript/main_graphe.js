// ----- constants
var min_score = 460;
var max_score = 5000;
var min_area = 2000;
var label_colors_happy = ["#52D726", "#FFEC00", "#FF7300", "#FF0000", "#007ED6"];
var label_colors = ["#1DC7BE", "#B284B5", "#B4340F", "#043E6E", "#E54DB1"];
var tweets_color = "#66b2ff";
var news_color = "#ff9933";
var modes = ["Default", "K-means classification"];

// need to reposition graphe whenever viewport changes
var topPos = document.getElementById('cy_container').offsetTop;
document.getElementById('cy').style.marginTop = topPos + "px";
document.addEventListener('keydown', function(event) {
    // full screen
    if(event.keyCode == 122) {
        location.reload();
    }
});

// alias for commonly used function
var $ = document.querySelector.bind(document);

// ----- attributes
var layout;
var removed_elems;
var mode;
var score_thr = 1000;

Promise.all([
    // style
    fetch('data/cy-style.json', {mode: 'no-cors'})
    .then(function(res) {
        return res.json();
    }),
    // data
    fetch('data/topics_connexions.json', {mode: 'no-cors'})
    .then(function(res) {
        return res.json();
    })
])
.then(function(dataArray) {
    var cy = window.cy = cytoscape({
        container: document.getElementById('cy'),
        style: dataArray[0],
        elements: dataArray[1],
        // interaction options :
        userZoomingEnabled:false,
        userPanningEnabled:false
    });
    // graphe layout
    layout = cy.layout(graphe_layout);
    layout.run();
    graphe_layout.randomize = false;

    // set node size
    cy.style()
        .selector('node')
        .style('width', function(elem) {
            var area = (parseFloat(elem.data('score'))/min_score) * min_area;
            return Math.sqrt(area/Math.PI);
        })
        .style('height', function(elem){
            var area = (parseFloat(elem.data('score'))/min_score) * min_area;
            return Math.sqrt(area/Math.PI);
        })
        .update();

    var to_rem = cy.nodes('[score < ' + score_thr + ']');
    removed_elems = cy.remove(to_rem);

    // sliders to tune the parameters
    var slider = {
          min: min_score,
          max: max_score,
          initial: score_thr
        }
    makeSlider(slider);

    cy.ready(function() {
        cy.nodes().forEach(function(ele) {
            makePopper(ele);
        });
    });

    cy.nodes().unbind('mouseover');
    cy.nodes().bind('mouseover', (event) => event.target.tippy.show());

    cy.nodes().unbind('mouseout');
    cy.nodes().bind('mouseout', (event) => event.target.tippy.hide());

    // --- Config ---
    $('#config-toggle').addEventListener('click', function(){
        $('body').classList.toggle('config-closed');
    });

    // setup mode selection
    d3.select("#graphSelectMode")
        .selectAll('Modes')
        .data(modes)
        .enter()
        .append('option')
        .text(function(d) {return d;})
        .attr("value", function(d){return d;});
    d3.select("#graphSelectMode").on("change", function(d) {
        // recover the option that has been chosen
        var selectedMode = d3.select(this).property("value");
        // run the updateChart function with this selected option
        updateMode(selectedMode);
    });
    // initialize with default mode
    updateMode(modes[0]);
});

function updateMode(selMode) {
    if(selMode == "Default") {
        cy.style()
            .selector('node')
            .style('background-color', "#555")
            .style('text-outline-color', "#555")
            .update();
    }
    else {
        cy.style()
            .selector('node')
            .style('background-color', function(elem){
                return label_colors[elem.data('label')];
            })
            .style('text-outline-color', function(elem){
                return label_colors[elem.data('label')];
            })
            .update();
    }
}

// popper for the name
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

// sliders
function makeSlider( opts ){
    var $input = create_dom_elem('input', {
        id: 'slider-nb-topics',
        type: 'range',
        min: opts.min,
        max: opts.max,
        step: 1,
        value: opts.initial,
        'class': 'slider'
    }, []);

    var $param = create_dom_elem('div', { 'class': 'param' }, []);
    var $label = create_dom_elem('label', { 'class': 'label label-default', for: 'slider-nb-topics' },
        [ create_dom_text('Select minimal number of apparitions') ]);
    var $output = create_dom_elem('output', {
        id: 'nb-topics-value',
        for: 'slider-nb-topics'
    }, []);
    $output.value = $input.value;

    $param.appendChild( $label );
    $param.appendChild( $input );
    $param.appendChild( $output);

    var $config = $('#cy-config');
    $config.appendChild( $param );

    // remove or add nodes depending on input value
    var update = _.throttle(function(){
        layout.stop();

        value = $input.value;
        $output.value = value;

        // add nodes
        if(value < score_thr) {
            // restore nodes
            var nodes_to_restore = removed_elems.filter('[score >= ' + value + ']');
            nodes_to_restore.restore();
            removed_elems = removed_elems.difference(nodes_to_restore);

            // restore edges
            var edges_to_restore = removed_elems.filter('edge[source = "-1"]');
            nodes_to_restore.forEach( function(ele, i, eles){
                var i_edges = removed_elems.filter(
                    'edge[source = "' + ele.id() + '"], edge[target= "' + ele.id() + '"]'
                )
                    .filter(function(edge, j, elses){
                        var target = edge.target();
                        return !target.removed();
                    });

                edges_to_restore = edges_to_restore.union(i_edges);
            });
            edges_to_restore.restore();
            removed_elems = removed_elems.difference(edges_to_restore);

        // remove nodes
        } else {
            var to_rem = cy.nodes('[score < ' + value + ']');
            removed_elems = removed_elems.union(cy.remove(to_rem));
        }
        score_thr = value;

        layout = cy.layout(graphe_layout);
        layout.run();

    }, 1000/30);

    $input.addEventListener('input', update);
    $input.addEventListener('change', update);
}

var create_dom_elem = function(tag, attrs, children){
    var el = document.createElement(tag);

    Object.keys(attrs).forEach(function(key){
        var val = attrs[key];
        el.setAttribute(key, val);
    });

    children.forEach(function(child){
        el.appendChild(child);
    });

    return el;
};

var create_dom_text = function(text){
    var el = document.createTextNode(text);
    return el;
};

var graphe_layout = {
    name: 'cose',
    idealEdgeLength: 100,
    avoidOverlap: true,
    avoidOverlapPadding: 10,
    nodeOverlap: 3000,
    refresh: 20,
    fit: true,
    padding: 10,
    randomize: false,
    componentSpacing: 100,
    nodeRepulsion: 100000,
    edgeElasticity: 32,
    nestingFactor: 5,
    gravity: 80,
    numIter: 1000,
    initialTemp: 200,
    coolingFactor: 0.95,
    minTemp: 1.0,
    animate: true,
    maxSimulationTime:5000
};
