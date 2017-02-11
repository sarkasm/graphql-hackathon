import graphFactory from './d3graph';
import renderTypeTable from './d3TypeTable';
import TypeCollection from './TypeCollection';

// construct d3 nodes & links based on type relationships
function inferRelations(schema) {
  const fields = (schema.get('fields') || []).map(f => f.name);
  const relations = schema.getRelations();

  const node = {
    id: schema.get('name'),
    entity: 'type',
    fields,
  };

  const links = relations.map(type => ({
    source: schema.id,
    target: type.get('name'),
  }));

  return { node, links };
}

// introspect the graphql endpoint
function getData(urlRoot) {
  const nodes = [];
  let links = [];

  const types = new TypeCollection({ urlRoot });

  const success = () => {
    types.each((type) => {
      const info = inferRelations(type);

      nodes.push(info.node);
      links = [...links, ...info.links];
    });

    graphFactory({ nodes, links });
    renderTypeTable(nodes[0]);
  };

  types.fetch({ success });
}

export { getData as default };
