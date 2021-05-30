
// create 2 data_set



var data1 = [ //emo
    {group: "good", value: 16, value2: 20},
    {group: "well", value: 24, value2: 14},
    {group: "great", value: 7, value2: 14},
    {group: "best", value: 10, value2: 10},
    {group: "hope", value: 7, value2: 9},
    {group: "love", value: 3, value2: 8},
    {group: "hard", value: 5, value2: 6},
    {group: "relief", value: 4, value2: 5},
    {group: "fear", value: 14, value2: 5},
    {group: "worst", value: 3, value2: 4}
];

var data2 = [ //regular
    {group: "covid19", value: 21, value2: 2},
    {group: "case", value: 9, value2: 25},
    {group: "coronavirus", value: 31, value2: 17},
    {group: "death", value: 5, value2: 12},
    {group: "pandemic", value: 5, value2: 10},
    {group: "mask", value: 4, value2: 8},
    {group: "health", value: 10, value2: 6},
    {group: "positive", value: 2, value2: 6},
    {group: "test", value: 3, value2: 5},
    {group: "vaccine", value: 6, value2: 4}
];

var data3 = [
    {group: "infection", value: 32, value2: 35},
    {group: "respiratory", value: 15, value2: 3},
    {group: "transmission", value: 6, value2: 14},
    {group: "prevention", value: 5, value2: 6},
    {group: "spreading", value: 7, value2: 11},
    {group: "clinical", value: 6, value2: 11},
    {group: "influenza", value: 4, value2: 2},
    {group: "antibody", value: 9, value2: 8},
    {group: "pathogen", value: 5, value2: 0},
    {group: "biological", value: 5, value2: 1}
];

/*var data4 = [
    {group: "new a", value: 3, value2: 70},
    {group: "new b", value: 15, value2: 20},
    {group: "new c", value: 20, value2: 100},
    {group: "new d", value: 106, value2: 20},
    {group: "new f", value: 14, value2: 10},
    {group: "new e", value: 14, value2: 8}
];*/

// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 660 - margin.left - margin.right,
    height = 340 - margin.top - margin.bottom;


const allHeight = 400 + margin.top + margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", 2*height + margin.top + margin.bottom )
    .append("g")
    .attr("transform",
        `translate(${margin.left},${height + margin.top})`)

// X axis``
/*var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data1.map(function(d) { return d.group; }))
    .padding(0.2);
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
*/
// Add Y axis
/*
var y = d3.scaleLinear()
    .domain([-20, 20])
    .range([-height, height]);

svg.append("g")
    .attr("class", "myYaxis")
    .call(d3.axisLeft(y));
    */

// initialize groups
var allGroup = ["emotions", "popular", "terminology"]

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

// Let's create axis elements here and we swill just update them in `update` function without creating a new 'g' element
svg.append("g")
    .attr("class", "myXaxis")
    .attr("transform", `translate(0,${height})`);

svg.append("text")
    .attr("x", 300)
    .attr("y", -250)
    .style("font-size", "20px")
    .style("text-align", "right")
    .style("fill", "#69b3a2")
    .style("text-anchor", "center")
    .text("News Data");

svg.append("text")
    .attr("x", 300)
    .attr("y", -225)
    .style("font-size", "20px")
    .style("text-align", "right")
    .style("fill", "#a2db47")
    .style("text-anchor", "center")
    .text("Tweets");


svg.append("g")
    .attr("class", "myYaxis1");
svg.append("g")
    .attr("class", "myYaxis2");


// A function that create / update the plot for a given variable:
function update(data) {
      console.log(data);
    var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(data.map(function(d) { return d.group; }))
        .padding(0.2);

     svg.selectAll("g.myXaxis")
        .call(d3.axisBottom(x))

    
    const maxValue = Math.max.apply(null, data.map(d => d.value));
    const maxValue2 = Math.max.apply(null, data.map(d => d.value2));

    // Add 2 Y axis. One for d.value and the second for d.value2
    var y = d3.scaleLinear()
        .domain([0, maxValue + 5]) //  Max from all values + small padding
        .range([0, -height]);
    svg.selectAll("g.myYaxis1")
        .call(d3.axisLeft(y));
    var y2 = d3.scaleLinear()
        .domain([0, maxValue2 + 5])
        .range([0, height]);
    svg.selectAll("g.myYaxis2")
        .call(d3.axisLeft(y2));


    const newData = convertData([...data]);
    var u = svg.selectAll("rect")
        .data(newData)

    // add value to plot with type data logic
    u.enter()
        .append("rect")
        .merge(u)
        .transition()
        .duration(1000)
        .attr("x", function(d) { return x(d.group); })
        .attr("y", function(d) { return d.type === 1 ? y(d.value) : y(0); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return -y(d.value) + y(0); })
        .attr("fill", function (d) {return d.type === 1 ? "#69b3a2" : "#a2db47"})
}

function convertData(data) {
    const newData = [];
    for (const d of data) {
        newData.push({group: d.group, value: d.value, type: 1});
        newData.push({group: d.group, value: d.value2, type: 2});
    }
    return newData;
}


function updateNew(selectedGroup) {
    switch(selectedGroup) {
        case "emotions":
            data = [...data1]
            break;
        case "popular":
            data = [...data2]
            break;
        case "terminology":
            data = [...data3]
            break;
        //case "my test":
        default:
            data = [...data1]
            break;

    }
    update(data)
}

d3.select("#selectButton").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")
    // run the updateChart function with this selected option
    updateNew(selectedOption)
})

// Initialize the plot with the first dataset
updateNew("emotions");