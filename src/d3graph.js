import * as d3 from 'd3';
import renderTypeTable from './d3TypeTable';

function switchDataPanel(d) {
  renderTypeTable(d);
}

function createGraph({ nodes, links }) {
  document.querySelector('svg').innerHTML = '';

  let simulation;

  const dragstarted = (d) => {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  };

  const dragged = (d) => {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  };

  const dragended = (d) => {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  };

  const svg = d3.select('svg');
  const width = +svg.attr('width');
  const height = svg.attr('height');

  const view = svg.append('g')
    .attr('class', 'view')
    .attr('x', 0.5)
    .attr('y', 0.5)
    .attr('width', width - 1)
    .attr('height', height - 1);

  const link = view.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(links)
    .enter()
    .append('line')
      .attr('opacity', 0.5)
      .attr('stroke-width', 5)
      .attr('fill', 'red');

  const node = view.append('g')
      .attr('class', 'nodes')
      .selectAll('.node')
      .data(nodes)
    .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

  node
    .append('circle')
    .attr('r', 10)
    .attr('fill', '#009688')
    .on('click', switchDataPanel);

  node.append('title')
    .text(d => d.id);

  node.append('text')
      .attr('dx', 12)
      .attr('dy', '.35em')
      .text(d => d.id);

  const ticked = () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node.attr('transform', ({ x, y }) => `translate(${x},${y})`);
  };

  simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink().id(d => d.id))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2));

  simulation
    .on('tick', ticked);

  simulation.force('link')
    .links(links)
    .distance(() => 100);

  function zoomed() {
    view.attr('transform', d3.event.transform);
  }

  const zoom = d3.zoom()
    .scaleExtent([-5, 40])
    .translateExtent([[-500, -500], [width + 500, height + 500]])
    .on('zoom', zoomed);

  svg.call(zoom);
}


export { createGraph as default };
