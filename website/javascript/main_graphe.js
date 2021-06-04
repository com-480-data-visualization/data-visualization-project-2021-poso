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
var cy;
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
    cy = window.cy = cytoscape({
        container: document.getElementById('cy'),
        // graphe layout
        layout: graphe_layout,
        style: dataArray[0],
        elements: dataArray[1],
        // interaction options :
        userZoomingEnabled:false,
        userPanningEnabled:false
    });

    // sliders to tune parameters
    var sliders = [
        {
          label: 'Edge length',
          param: 'edgeLengthVal',
          min: 1,
          max: 200
        }, {
          label: 'Node spacing',
          param: 'nodeSpacing',
          min: 1,
          max: 50
        }
    ];
    sliders.forEach( makeSlider );

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
    var $input = create_elem('input', {
        // id: 'slider-'+opts.param,
        type: 'range',
        min: opts.min,
        max: opts.max,
        step: 1,
        value: graphe_layout[ opts.param ],
        'class': 'slider'
    }, []);

    var $param = create_elem('div', { 'class': 'param' }, []);
    var $label = create_elem('label', { 'class': 'label label-default', for: 'slider-'+opts.param }, [ t(opts.label) ]);

    $param.appendChild( $label );
    $param.appendChild( $input );

    var $config = $('#cy-config');
    $config.appendChild( $param );

    var update = _.throttle(function(){
        graphe_layout[ opts.param ] = $input.value;

        // layout.stop();
        // layout = makeLayout();
        // layout.run();
    }, 1000/30);

    $input.addEventListener('input', update);
    $input.addEventListener('change', update);
}

var create_elem = function(tag, attrs, children){
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

var t = function(text){
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
};
