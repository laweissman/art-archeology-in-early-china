document.addEventListener("DOMContentLoaded", function() {
    // Define the dimensions and margins of the timeline
    const margin = {top: 20, right: 50, bottom: 80, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Create SVG element
    const svg = d3.select("body").append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create scales for the timeline
    const xScale = d3.scaleTime()
        .domain([new Date(-5000, 0), new Date()]) // Adjust dates as per your data
        .range([0, width]);

    // Create the timeline axis
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.utcFormat("%Y"));
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)"); // Rotate labels

    // Add nodes for each period
    let labelCounter = 0;
    data.forEach(period => {
        const startYear = new Date(period.startYear, 0);
        const endYear = new Date(period.endYear, 0);
        const duration = period.endYear - period.startYear;

        // Create a group for each period
        const group = svg.append("g");

        // Add line for the period
        group.append("line")
            .attr("x1", xScale(startYear))
            .attr("x2", xScale(endYear))
            .attr("y1", height/2)
            .attr("y2", height/2)
            .attr("stroke", "black")
            .attr("stroke-width", 2);

        // Add node for the start of the period
        group.append("circle")
            .attr("cx", xScale(startYear))
            .attr("cy", height/2)
            .attr("r", Math.sqrt(duration) / 100 + 5) // Node size varies with duration
            .attr("fill", "blue");

        // Add staggered text label for the period
        group.append("text")
            .attr("x", xScale(startYear))
            .attr("y", height/2 + (labelCounter % 2 === 0 ? -20 : 20)) // Stagger labels
            .text(period.period)
            .attr("font-size", "12px")
            .attr("text-anchor", "middle");

        labelCounter++;
    });
});
