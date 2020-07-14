// nPrentko

// Declare all the parameters for the svg.
let svgWidth = 950;
let svgHeight = 550;


let margin = {
top: 25,
right: 45,
bottom: 75,
left:95
};

let height = svgHeight - margin.top - margin.bottom;
let width = svgWidth - margin.left - margin.right;


// Declare and assign a variable to hold the svg wrapper.
// Set appropriate attributes. Append svg group for interactive scatter plot. 
// Use call responsivefy to create appropriate chart size
let svg = d3
    .select("body")
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)
   

// Append svg group element to commence a container that holds
// all child svg elements.
let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Set the default parameters of the scatter plots x and y axis. 
let chosenXAxis = "poverty";
let chosenYAxis = "healthcare";

// Call function that will update the x-scale when labels are clicked.
function xScale(data, chosenXAxis) {
// Create the various scales necessary.
    let xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
            d3.max(data, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;
};

// Call the function that will update the y-scale when labels are clicked.
function yScale(data, chosenYAxis) {
// Create the various scales necessary.
    let yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
            d3.max(data, d => d[chosenYAxis]) * 1.2
        ])
        .range([height, 0]);
    
    return yLinearScale;

};

// Call the function used for changing xAxes.
function renderXAxes(newXScale, xAxis) {
    let bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(2000)
        .call(bottomAxis);
    
    return xAxis;
};

// Call the function used for changing the yAxes.
function renderYAxes(newYScale, yAxis) {
    let leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(2000)
        .call(leftAxis);

    return yAxis;
}

// Render circles and call function to change the circles group
// at the time data changes in accordanc with axes.
function renderCircles(circleGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(2000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    
        return circlesGroup;
}

// Call function that will update state labels.
function renderText(abbreviations, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    abbreviations.transition()
        .duration(2000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));
    
    return abbreviations;
}

// Call function that will update the circlesGroup via toolTip.
function updateToolTip(circlesGroup, chosenXAxis, chosenYAxis) {

// Declare the variable label and assign it the value of an empty string.
    let label= "";

// Delcare some if/then clauses for the various topics pertaing
// to the xaxes 
    if (chosenXAxis === "poverty") {
        label = "Percentage In Poverty: ";
    }

    else if (chosenXAxis === "age") {
        label = "Age (Median): ";
    }

    else if (chosenXAxis === "income"){
        label ="Household Income (Median): $";
    }

// Declare the variable label and assign it the value of an empty string.
    let yLabel= "";

// Delcare some if/then clauses for the various topics pertaing
// to the yaxes.
    if (chosenYAxis === "healthcare") {
        ylabel = "Percentage Lacks Healthcare:";
    }

    else if (chosenYAxis === "obesity") {
        ylabel = "Percent Obese: ";
    }

    else if(chosenYAxis === "smokes") {
        ylabel = "Percent Smokers: ";
    }

// Set up the toolTip for the scatter plot
    let toolTip = d3
        .tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(d => {
            if (chosenXAxis === "poverty") {
                return (`${d.state}<br>${label} ${d[chosenXAxis]}%<br>${yLabel} ${d[chosenYAxis]}%`)
            }
            else {
                return (`${d.state}<br>${label} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}%`)
            });
    
        circlesGroup.call(toolTip);

        // Set parameters for mouseover and mouseout 
        circlesGroup
            .on("mouseover", function(data) {
        toolTip.show(data);
        })

            .on("mouseout", function(data, index) {
        toolTip.hide(data);
        });

    return circlesGroup;
};

// Read in data from the csv file. 
d3.csv("assets/data/data.csv").then(function(censusData, err) {
    if (err) throw err;

// Use parseFloat function to parse the data. 
    censusData.forEach(function(censusData) {
        censusData.poverty = parseFloat(censusData.poverty);
        censusData.age = parseFloat(censusData.age);
        censusData.income = parseFloat(censusData.income);
        censusData.healthcare = parseFloat(censusData.healthcare);
        censusData.smokes = parseFloat(censusData.smokes);
        censusData.obesity = parseFloat(censusData.obesity);
    });

// Let xLinearScale equate to a new function pertaining to 
// chosenXAxis and data pertainging to it. 
    let xLinearScale = xScale(censusData, chosenXAxis);

// Let xLinearScale equate to a new function pertaining to 
// chosenXAxis and data pertainging to it.
    let yLinearScale = yScale(censusData, chosenYAxis);

// Create a function for the bottom axis with d3
    let bottomAxis = d3.axisBottom(xLinearScale);

// Create a function for the left axis with d3
    let leftAxis = d3.axisLeft(yLinearScale);

// Use .append to append the svg group to the xAxis
    let xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

// Use append to append the svg group to the yAxis
    let yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

// Add data to the circles group. Append the initial circles
// apply the necessary attributions via .attr.
    let circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 15)
        .attr("fill", "green")
        .attr("opacity", ".75");

// Add data to the abbreviations. Append the state's abbreviations.
// Apply all necessary attributes.
    let abbreviations = chartGroup.selectAll(".stateText")
        .data(censusData)
        .enter()
        .append("text")
        .classed ("stateText", true)
        .text(d => d.abbr)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "9px")
        .attr("style", "stroke:white;")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("dy", 3);

// Create a variable called xLabels that is a group for the
// three different x-axis labels. 
    let xLabels = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

// Create a variable, pLabel, to hold the
// classes, attributes and text of the lable pretaing to poverty. 
    let pLabel = xLabels.append("text")
        .classed("aText", true)
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)");

// Create a variable, aLabel, to hold the
// classes, attributes and text of the lable pretaing to mean age.
    let aLabel = xLabels.append("text")
        .classed("aText", true)
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (Median)");

// Create a variable, iLabel, to hold the
// classes, attributes and text of the lable pretaing to income.
    let iLabel = xLabels.append("text")
        .classed("aText", true)
        .attr("x", 0)
        .attr("y", 55)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Household Income (Median)");

// Create a variable called yLabels that is a group for the
// three different y-axis labels. 
    let yLabels = chartGroup.append("g")
        .attr("transform", `translate(${0 - margin.left/4}, ${(height/2)})`);

// Create a variable, oLabel, to hold the
// classes, attributes and text of the lable pretaing to obesity.
    let oLabel = yLabels.append("text")
        .classed("aText", true)
        .classed("active", true)
        .attr("x", 0 - (height/2))
        .attr("y", -20 - (margin.left/3))
        .attr("dy", "1em")
        .attr("value", "obesity")
        .attr("transform", "rotate(-90)")
        .text("Obese (%)");

// Create a variable, hcLabel, to hold the
// classes, attributes and text of the lable pretaing to healthcare.
    let hcLabel = yLabels.append("text")
          .classed("aText", true)
          .classed("inactive", true)
          .attr("x", 0)
          .attr("y", 0 - 20)
          .attr("dy", "1em")
          .attr("transform", "rotate(-90)")
          .attr("value", "healthcare")
          .text("Lacks Healthcare (%)");
    
// Create a variable, sLabel, to hold the
// classes, attributes and text of the lable pretaing to smokers.   
    let sLabel = yLabels.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0 - (height/2))
        .attr("y", -40 - (margin.left/3))
        .attr("dy", "1em")
        .attr("value", "smokes")
        .attr("transform", "rotate(-90)")
        .text("Smokers (%)");
    
// Bring circleGroup variable, which is a tooltip function up-to-date.
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

// Use .selectall to establish a listener on click for xAxis.
    xLabels.selectAll("text")
        .on("click", function() {
        
        // Let the variable, value, equate to what is clicked on.
        let value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

            // Convert the chosen XAxis to the value.
            chosenXAxis = value;

            // Change the value of the xLinearScale to the data of the chosenXAxis.
            xLinearScale = xScale(censusData, chosenXAxis);

            // Change the value of xAxis to contain the renderXAxes
            xAxis = renderXAxes(xLinearScale, xAxis);
            
            // Change the value by using renderCircles function, so the value relates to x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
            
            // Use the renderText function to update the state abbreviations
            abbreviations = renderText(abbreviations, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            // Use updateToolTip function to update tooltips with new data
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
        
            // Create three if/then clauses to make the text of the clicked on
            // labels bold.
            if (chosenXAxis === "age") {
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                
                ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
                
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }

            else if (chosenXAxis === "poverty") {
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                
                povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
            
             else if(chosenXAxis === "income"){
                incomeLabel
                    .classed("active", true)
                    .classed("inactive", false);
                
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                
                povertyLabel
                    .classedO("active", false)
                    .classed("inactive", true);
                    }
                }
             });
        
        // Use .selectAll to create a ylabel listener
        yLabels.selectAll("text")
             .on("click", function() {
                
                // Use d3 to get the value of the label clicked
                let value = d3.select(this).attr("value");
                
                // Create if/then clause to dictate what to do if a different
                // label is clicked. 
                if (value !== chosenYAxis) {
                    
                    // Let the variable, value, be the value of chosenXAxis
                    chosenYAxis = value;

                    // Make sure the yLinearScale variable is set to the value of 
                    // the chosenYAxis
                    yLinearScale = yScale(censusData, chosenYAxis);
                    
                    // Make the value of yAxis what was clicked
                    yAxis = renderYAxes(yLinearScale, yAxis);

                    // Make the value of circleGroup with respect of the current selection of yAxis
                    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis,  yLinearScale, chosenYAxis);

                    circlesGroup = updateToolTip(circlesGroup, chosenYAxis);

                    // Use the renderText function to update the state abbreviations
                    abbreviations = renderText(abbreviations, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                    // Create three if/then clauses to make the text of the clicked on
                    // labels bold.
                    if (chosenYAxis === "smokes") {
                        smokesLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        obesityLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        healthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else if (chosenYAxis === "obesity") {
                        smokesLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        
                        obesityLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        
                        healthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else if (chosenYAxis === "healthcare") {
                        healthcareLabel
                          .classed("active", true)
                          .classed("inactive", false);
                        smokesLabel
                          .classed("active", false)
                          .classed("inactive", true);
                        obesityLabel
                          .classed("active", false)
                          .classed("inactive", true);
                    }
                }
             });

            // Use the catch statement to define a block of code to be executed, 
            // if an error occurs in the try block.
            }).catch(function(error) {
                console.log(error);
            }); 
