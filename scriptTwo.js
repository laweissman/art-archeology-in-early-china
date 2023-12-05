// Import D3 library
import * as d3 from 'd3';

// Function to create the Sankey diagram
async function createSankeyDiagram() {
    // Specify the dimensions of the chart.
    const width = 928;
    const height = 600;
    const format = d3.format(",.0f");

    // Load data from CSV
    const data = await d3.csv("Schools_of_Thought_Spring_and_Autumn_Warring_States.csv");

    // Process the data to fit the Sankey diagram format
    const { nodes, links } = processData(data);

    // Create a SVG container.
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    // Constructs and configures a Sankey generator.
    const sankey = d3.sankey()
        .nodeId(d => d.name)
        .nodeAlign(d3.sankeyJustify) // or use d3.sankeyLeft, d3.sankeyRight
        .nodeWidth(15)
        .nodePadding(10)
        .extent([[1, 5], [width - 1, height - 5]]);

    // Applies it to the data
    const { nodes: graphNodes, links: graphLinks } = sankey({
        nodes: nodes.map(d => Object.assign({}, d)),
        links: links.map(d => Object.assign({}, d))
    });

    // Defines a color scale.
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Creates the rects that represent the nodes.
    const rect = svg.append("g")
        .attr("stroke", "#000")
        .selectAll("rect")
        .data(graphNodes)
        .join("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("fill", d => color(d.name));

    // Adds a title on the nodes.
    rect.append("title")
        .text(d => `${d.name}\n${format(d.value)}`);

    // Creates the paths that represent the links.
    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.5)
        .selectAll("g")
        .data(graphLinks)
        .join("g")
        .style("mix-blend-mode", "multiply");

    link.append("path")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke", d => color(d.source.name))
        .attr("stroke-width", d => Math.max(1, d.width));

    link.append("title")
        .text(d => `${d.source.name} → ${d.target.name}\n${format(d.value)}`);

    // Adds labels on the nodes.
    svg.append("g")
        .selectAll("text")
        .data(graphNodes)
        .join("text")
        .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
        .text(d => d.name);

    return svg.node();
}

// Function to process the CSV data into nodes and links
function processData(data) {
    let nodes = [];
    let links = [];

    // Create nodes for each school and century
    data.forEach(d => {
        nodes.push({ name: d.School });
        nodes.push({ name: d.Century });
    });

    // Remove duplicate nodes
    nodes = Array.from(new Set(nodes.map(d => d.name)))
        .map(name => {
            return {
                name: name
            };
        });

    // Create links based on the Century
    data.forEach(d => {
        links.push({ source: d.School, target: d.Century, value
