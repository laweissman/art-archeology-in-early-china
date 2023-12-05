document.addEventListener('DOMContentLoaded', function() {
  // Load the JSON data from dataOne.json
  d3.json('flare.json').then(function(data) {
    console.log('Data loaded:', data); // Check if data is loaded correctly

    // Set the dimensions for the tree layout
    const width = 928;
    const root = d3.hierarchy(data);
    const dx = 10;
    const dy = width / (root.height + 1);

    // Create the tree layout
    const tree = d3.tree().nodeSize([dx, dy]);
    root.sort((a, b) => d3.ascending(a.data.name, b.data.name));
    tree(root);

    // Compute the extent of the tree
    let x0 = Infinity;
    let x1 = -x0;
    root.each(d => {
      if (d.x > x1) x1 = d.x;
      if (d.x < x0) x0 = d.x;
    });

    // Compute the adjusted height of the tree
    const height = x1 - x0 + dx * 2;

    // Create the SVG element
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-dy / 3, x0 - dx, width, height])
        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    // Add links (lines) to the SVG
    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5)
      .selectAll("path")
        .data(root.links())
        .join("path")
          .attr("d", d3.linkHorizontal()
              .x(d => d.y)
              .y(d => d.x));

    // Add nodes to the SVG
    const node = svg.append("g")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
      .selectAll("g")
      .data(root.descendants())
      .join("g")
        .attr("transform", d => `translate(${d.y},${d.x})`);

    // Add circles for each node
    node.append("circle")
        .attr("fill", d => d.children ? "#555" : "#999")
        .attr("r", 2.5);

    // Add text for each node
    node.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d.children ? -6 : 6)
        .attr("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.name)
      .clone(true).lower()
        .attr("stroke", "white");

    // Append the SVG to the chart container
    document.getElementById('chart').appendChild(svg.node());

  }).catch(function(error) {
    console.error('Error loading or parsing data:', error);
  });
});
