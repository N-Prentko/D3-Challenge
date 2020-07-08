let svgWidth = 950;
let svgHeight = 550;


let margin = {
    right: 40,
    left: 100,
    top: 30,
    bottom: 85

};

let height = svgHeight - margin.top - margin.bottom;
let width = svgWidth - margin.left - margin.right;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function(demoData, err) {

    demoData.forEach(function(data) {
        data.poverty =+ data.poverty;
        data.healthcare =+ data.healthcare;
    });

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(demoData, d => d.poverty) - 2, d3.max(demoData, d => d.poverty)])
        .range([height, 0]);
    
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(demoData, d => d.healthcare)])
        .range([height, 0]);
})