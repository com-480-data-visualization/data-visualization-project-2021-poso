// set the dimensions and margins of the graph
var margin_sank = {top: 10, right: 10, bottom: 10, left: 10},
    width_sank = 850 - margin_sank.left - margin_sank.right,
    height_sank = 880 - margin_sank.top - margin_sank.bottom;

// append the svg object to the body of the page
var svg_sank = d3.select("#sank").append("svg")
    .attr("width", width_sank + margin_sank.left + margin_sank.right)
    .attr("height", height_sank + margin_sank.top + margin_sank.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin_sank.left + "," + margin_sank.top + ")");

// Color scale used
var color = d3.scaleOrdinal(d3.schemeCategory20);

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(6) //36
    .nodePadding(20) //290
    .size([width_sank, height_sank]);

// load the data
d3.json("data/sank.json", function(error, graph) {
    /*graph = {
        nodes:[
            {node:0,name:"india"},
            {node:1,name:"china"},
            {node:2,name:"russia"},
            {node:3,name:"usa"},
            {node:4,name:"virus"},
            {node:5,name:"health"},
            {node:6,name:"case"},
            {node:7,name:"covid"},
            {node:8,name:"spread"},
            {node:9,name:"infection"},
            {node:10,name:"death"},
            {node:11,name:"vaccine"},
            {node:12,name:"high (> 5000)"},
            {node:13,name:"middle (> 500)"},
            {node:14,name:"low"},
        ],
        links:[{source:4,target:0,value:4},
            {source:5,target:0,value:7},
            {source:6,target:0,value:40},
            {source:7,target:0,value:5},
            {source:8,target:0,value:23},
            {source:9,target:0,value:11},
            {source:10,target:0,value:46},
            {source:11,target:0,value:3},
            {source:4,target:1,value:5},
            {source:5,target:1,value:1},
            {source:6,target:1,value:2},
            {source:7,target:1,value:1},
            {source:8,target:1,value:16},
            {source:9,target:1,value:1},
            {source:10,target:1,value:1},
            {source:11,target:1,value:4},
            {source:4,target:2,value:1},
            {source:5,target:2,value:2},
            {source:6,target:2,value:1},
            {source:7,target:2,value:1},
            {source:8,target:2,value:1},
            {source:9,target:2,value:1},
            {source:10,target:2,value:1},
            {source:11,target:2,value:32},
            {source:4,target:3,value:1},
            {source:5,target:3,value:1},
            {source:6,target:3,value:3},
            {source:7,target:3,value:1},
            {source:8,target:3,value:4},
            {source:9,target:3,value:1},
            {source:10,target:3,value:6},
            {source:11,target:3,value:1},
            {source:0,target:12,value:46},
            {source:0,target:13,value:46},
            {source:0,target:14,value:46},
            {source:1,target:12,value:10},
            {source:1,target:13,value:10},
            {source:1,target:14,value:10},
            {source:2,target:12,value:13},
            {source:2,target:13,value:13},
            {source:2,target:14,value:13},
            {source:3,target:12,value:2},
            {source:3,target:13,value:5},
            {source:3,target:14,value:10},
        ]}/*
    /**/
    // Constructs a new Sankey generator with the default settings.
    sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(1);

    // add in the links
    var link = svg_sank.append("g")
        .selectAll(".link")
        .data(graph.links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", sankey.link())
        .style("stroke-width", function (d) {
            return Math.max(1, d.dy);
        })
        .sort(function (a, b) {
            return b.dy - a.dy;
        });

    // add in the nodes
    var node = svg_sank.append("g")
        .selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        })
        .call(d3.drag()
            .subject(function (d) {
                return d;
            })
            .on("start", function () {
                this.parentNode.appendChild(this);
            })
            .on("drag", dragmove));

    // add the rectangles for the nodes
    node
        .append("rect")
        .attr("height", function (d) {
            return d.dy;
        })
        .attr("width", sankey.nodeWidth())
        .style("fill", function (d) {
            return d.color = color(d.name.replace(/ .*/, ""));
        })
        .style("stroke", function (d) {
            return d3.rgb(d.color).darker(2);
        })
        // Add hover text
        .append("title")
        .text(function (d) {
            return d.name + "\n" + "There is " + d.value + " stuff in this node";
        });

    // add in the title for the nodes
    node
        .append("text")
        .attr("x", -6)
        .attr("y", function (d) {
            return d.dy / 2;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function (d) {
            return d.name;
        })
        .filter(function (d) {
            return d.x < width_sank / 2;
        })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

    // the function for moving the nodes
    function dragmove(d) {
        d3.select(this)
            .attr("transform",
                "translate("
                + d.x + ","
                + (d.y = Math.max(
                    0, Math.min(height_sank - d.dy, d3.event.y))
                ) + ")");
        sankey.relayout();
        link.attr("d", sankey.link());
    }
    ;
})
