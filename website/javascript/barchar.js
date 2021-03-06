
// create 2 data_set
var data1 = [
    {group: "virus", value: 16, value2: 20},
    {group: "coronavirus", value: 20, value2: 10},
    {group: "china", value: 10, value2: 8},
    {group: "health", value: 6, value2: 20},
    {group: "people", value: 10, value2: 10},
    {group: "case", value: 5, value2: 8}

];

var data2 = [
    {group: "virus", value: 20, value2: 7},
    {group: "coronavirus", value: 12, value2: 20},
    {group: "china", value: 16, value2: 10},
    {group: "health", value: 12, value2: 20},
    {group: "people", value: 8, value2: 10},
    {group: "case", value: 10, value2: 8}
];

var data3 = [
    {group: "virus", value: 3, value2: 7},
    {group: "coronavirus", value: 15, value2: 20},
    {group: "china", value: 20, value2: 10},
    {group: "health", value: 16, value2: 20},
    {group: "people", value: 14, value2: 10},
    {group: "case", value: 14, value2: 8}
];

// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom )
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// X axis
/*var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data1.map(function(d) { return d.group; }))
    .padding(0.2);
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
*/
// Add Y axis
var y = d3.scaleLinear()
    .domain([0, 20])

    .range([height, 0]);
svg.append("g")
    .attr("class", "myYaxis")
    .call(d3.axisLeft(y));

// initialize groups
var allGroup = ["real news", "fake news", "tweets"]

//var color = d3.scale.ordinal()
//    .range(["#ca0020","#f4a582","#d5d5d5","#92c5de","#0571b0"]);

// add the options to the button
d3.select("#selectButton")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button


// A function that create / update the plot for a given variable:
function update(data) {
    var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(data.map(function(d) { return d.group; }))
        .padding(0.2);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))

    var u = svg.selectAll("rect")
        .data(data)

    u
        .enter()
        .append("rect")
        .merge(u)
        .transition()
        .duration(1000)
        .attr("x", function(d) { return x(d.group); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", "#69b3a2")

    svg.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar2")
        .attr("x", function(d) { return x(d.group); })
        .attr("y", function (d) {
            return y(d.value2);
        })
        .attr("height", function (d) {
            return  height - y(d.value2);
        })
        .attr("fill", "#a2db47")
        .attr("width", x.bandwidth());
}

function updateNew(selectedGroup) {

    // Create new data with the selection?
    if (selectedGroup == "real news") {
        data = data1
        update(data)
    } else {
        if (selectedGroup == "fake news") {
            data = data2
            update(data)
        } else {
            data = data3
            update(data)
        }
    }
}

d3.select("#selectButton").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")
    // run the updateChart function with this selected option
    updateNew(selectedOption)
})

// Initialize the plot with the first dataset
updateNew(data1)