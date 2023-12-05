document.addEventListener("DOMContentLoaded", function() {
    // Define the dimensions of the timeline
    const width = 1000;
    const height = 200;
    const padding = 50;

    // Create SVG element
    const svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    // Create scales for the timeline
    const xScale = d3.scaleTime()
        .domain([new Date(-5000, 0), new Date(2023, 0)]) // Adjust dates as per your data
        .range([padding, width - padding]);

    // Create the timeline axis
    const xAxis = d3.axisBottom(xScale);
    svg.append("g")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis);

    // Add nodes for each period
    data.forEach(period => {
        const startYear = new Date(period.startYear, 0);
        const endYear = new Date(period.endYear, 0);

        // Create a group for each period
        const group = svg.append("g");

        // Add line for the period
        group.append("line")
            .attr("x1", xScale(startYear))
            .attr("x2", xScale(endYear))
            .attr("y1", height / 2)
            .attr("y2", height / 2)
            .attr("stroke", "black")
            .attr("stroke-width", 2);

        // Add node for the start of the period
        group.append("circle")
            .attr("cx", xScale(startYear))
            .attr("cy", height / 2)
            .attr("r", 5)
            .attr("fill", "blue");

        // Add text label for the period
        group.append("text")
            .attr("x", xScale(startYear))
            .attr("y", height / 2 - 10)
            .text(period.period)
            .attr("font-size", "12px")
            .attr("text-anchor", "middle");
    });
});
