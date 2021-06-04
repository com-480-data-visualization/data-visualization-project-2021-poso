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

// fetch data and launch
var score_thr = 1000;
var removed_elems;
Promise.all([
    // style
    fetch('data/cy-style.json', {mode: 'no-cors'})
    .then(function(res) {
        return res.json()
    }),
    // data
    fetch('data/topics_connexions_500.json', {mode: 'no-cors'})
    .then(function(res) {
        return res.json()
    })
])
.then(function(dataArray) {
    var cy = window.cy = cytoscape({
        container: document.getElementById('cy'),
        // graphe layout
        layout: graphe_layout,
        style: dataArray[0],
        elements: dataArray[1],
        // interaction options :
        userZoomingEnabled:false,
        userPanningEnabled:false
    });

    var to_rem = cy.nodes('[score < ' + score_thr + ']');
    removed_elems = cy.remove(to_rem);

    // sliders to tune the parameters
    var slider = {
          min: 460,
          max: 5000,
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
});

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
        [ create_dom_text('Min number of apparitions') ]);
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
    minTemp: 1.0,
    animate: true
};
