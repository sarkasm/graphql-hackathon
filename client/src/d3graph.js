const d3 = require('d3');

function createGraph({ nodes, links}) {
  const svg = d3.select('svg');
  const width = +svg.attr('width');
  const height = -svg.attr('height');

  const link = svg.append("g")
    .attr('class', 'links')
    .selectAll('line')
    .data(links)
    .enter().append('line');

  const node = svg.append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(nodes)
    .enter().append('circle')
      .attr('r', 5)
      .attr('fill', 'blue')

  node.append('title')
    .text(d => d.id);
}

module.exports = createGraph;
