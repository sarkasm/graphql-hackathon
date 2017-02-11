const d3 = require('d3');
const renderTypeTable = require('./d3TypeTable');

function createGraph({ nodes, links}) {
  let simulation;

  const dragstarted = (d) => {
    if(!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  const dragged = (d) => {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  const dragended = (d) => {
    if(!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  const svg = d3.select('svg');
  const width = +svg.attr('width');
  const height = svg.attr('height');

  const link = svg.append("g")
    .attr('class', 'links')
    .selectAll('line')
    .data(links)
    .enter().append('line')
      .attr('opacity', 0.5)
      .attr('stroke-width', 5)
      .attr('fill', 'red');

  const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('.node')
      .data(nodes)
    .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))

  node
    .append('circle')
    .attr('r', 10)
    .attr('fill', '#009688')
    .on('click', switchDataPanel)

  node.append('title')
    .text(d => d.id);

  node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(d => d.id);

  const ticked = () => {
    console.log('ticked');
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  }

  simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink().id(d => d.id))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width/2, height/2));

  simulation
    .on('tick', ticked);

  simulation.force('link')
    .links(links)
    .distance(() => 100);
}

function switchDataPanel(d) {
  renderTypeTable(d);
}

module.exports = createGraph;
