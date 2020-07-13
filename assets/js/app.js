// nPrentko


let svgWidth = 960;
let svgHeight = 500;


let margin = {
top: 20,
right: 40,
bottom: 80,
left:100
};

let height = svgHeight - margin.top - margin.bottom;
let width = svgWidth - margin.left - margin.right;

let svg = d3
    .select("body")
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)
    .call(responsivefy);

let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let chosenXAxis = "poverty";
let chosenYAxis = "healthcare";

function xScale(data, chosenXAxis) {

    let xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
            d3.max(data, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;
};

function yScale(data, chosenYAxis) {

    let yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
            d3.max(data, d => d[chosenYAxis]) * 1.2
        ])
        .range([height, 0]);
    
    return yLinearScale;

};

function renderXAxes(newXScale, xAxis) {
    let bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    return xAxis;
};

function renderYAxes(newYScale, yAxis) {
    let leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

function renderCircles(circleGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    
        return circlesGroup;
}

function renderLabels(cLabels, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    cLabels.transition()
        .duration(2000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));
    
    return cLabels;
}

function updateToolTip(circlesGroup, chosenXAxis, chosenYAxis) {

    let label= "";

    if (chosenXAxis === "poverty") {
        label = "Percentage In Poverty: ";
    }

    else if (chosenXAxis === "age") {
        label = "Age (Median): ";
    }

    else if (chosenXAxis === "income"){
        label ="Household Income (Median): $";
    }

    let yLabel= "";

    if (chosenYAxis === "healthcare") {
        ylabel = "Percentage Lacks Healthcare:";
    }

    else if (chosenYAxis === "obesity") {
        ylabel = "Percent Obese: ";
    }

    else if(chosenYAxis === "smokes") {
        ylabel = "Percent Smokers: ";
    }

    var toolTip = d3.tip()
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

        circlesGroup
            .on("mouseover", function(data) {
        toolTip.show(data);
        })

            .on("mouseout", function(data, index) {
        toolTip.hide(data);
        });

    return circlesGroup;
};

d3.csv("assets/data/data.csv").then(function(censusData, err) {
    if (err) throw err;

    censusData.forEach(function(censusData)) {
        censusData.poverty = parseFloat(censusData.poverty);
        censusData.age = parseFloat(censusData.age);
        censusData.income = parseFloat(censusData.income);
        censusData.healthcare = parseFloat(censusData.healthcare);
        censusData.smokes = parseFloat(censusData.smokes);
        censusData.obesity = parseFloat(censusData.obesity);
    });


    let xLinearScale = xScale(censusData, chosenXAxis);

    let yLinearScale = yScale(censusData, chosenYAxis);

    let bottomAxis = d3.axisBottom(xLinearScale);

    let leftAxis = d3.axisLeft(yLinearScale);

    let xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    let yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);
    
    let theCircles = chartGroup.selectAll("iCircle")
        .data(censusData)
        .enter()
        .append("iCircle")
        .classed("theCircles", true)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 15)
        .attr("fill", "green")
        .attr("opacity", ".75");
    
    let abbreviations = chartGroup.selectAll(".sName")
        .data(censusData)
        .enter()
        .append("text")
        .classed ("sName", true)
        .text(d => d.abbr)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "9px")
        .attr("style", "stroke:white;")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("dy", 3);

    let xLabels = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
    
    let pLabels = xLabels.append("text")
        .classed("aText", true)
        .attr("x", 0)
        .attr("y", 15)
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)");
    
    let aLabels = xLabels.append("text")
        .classed("aText", true)
        .attr("x", 0)
        .attr("y", 35)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (Median)");
    
    let iLabels = xLabels.append("text")
        .classed("aText", true)
        .attr("x", 0)
        .attr("y", 55)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Household Income (Median)");
    
    let yLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${0 - margin.left/4}, ${(height/2)})`);


    let oLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("active", true)
        .attr("x", 0 - (height/2))
        .attr("y", -20 - (margin.left/3))
        .attr("dy", "1em")
        .attr("value", "obesity")
        .attr("transform", "rotate(-90)")
        .text("Obese (%)");
    
    let hcLabel = yLabelsGroup.append("text")
          .classed("aText", true)
          .classed("inactive", true)
          .attr("x", 0)
          .attr("y", 0 - 20)
          .attr("dy", "1em")
          .attr("transform", "rotate(-90)")
          .attr("value", "healthcare")
          .text("Lacks Healthcare (%)");
    
    
    let sLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0 - (height/2))
        .attr("y", -40 - (margin.left/3))
        .attr("dy", "1em")
        .attr("value", "smokes")
        .attr("transform", "rotate(-90)")
        .text("Smokers (%)");
    
    theCircles = updateToolTip(theCircles, chosenXAxis, chosenYAxis);

    xLabels.selectAll("text")
        .on("click", function() {
        
        let value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

            chosenXAxis = value;

            xLinearScale = xScale(theData, chosenXAxis);

            xAxis = renderXAxesY(xLinearScale, xAxis);
            
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
            
            textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
        
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
        
        yLabelsGroup.selectAll("text")
             .on("click", function() {
                
                let value = d3.select(this).attr("value");
                if (value !== chosenYAxis) {
                    
                    chosenYAxis = value;

                    yLinearScale = yScale(censusData, chosenYAxis);

                    yAxis = renderYAxes(yLinearScale, yAxis);

                    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis,  yLinearScale, chosenYAxis);

                    circlesGroup = updateToolTip(circlesGroup, chosenYAxis);

                    cLabels = renderLabels(cLabels, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

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

            }).catch(function(error) {
                console.log(error);
        }); 
