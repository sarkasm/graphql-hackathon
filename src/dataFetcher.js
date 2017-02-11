import  { pluck } from 'ramda';
const graphFactory = require('./d3graph');
const renderTypeTable = require('./d3TypeTable');
const TypeCollection = require('./TypeCollection');


function inferRelations(schema) {
  const relations = schema.getRelations();
  const fields = schema.get('fields') || [];
  const field_names = pluck('name', fields);

  const node = {
    id: schema.get('name'),
    entity: 'type',
    fields: field_names,
  };

  const links = relations.map(type => ({
    source: schema.id,
    target: type.get('name'),
  }));

  return { node, links };
}

function getData(urlRoot){
  var nodes= [];
  var links= [];

  const types = new TypeCollection({ urlRoot });

  types.fetch({success: () => {
    types.each(type => {
      const info = inferRelations(type);
      nodes.push(info.node);
      links = [...links, ...info.links];
    });

    var out = {
      'nodes': nodes,
      'links': links
    };

    graphFactory(out);
    renderTypeTable(out.nodes[0]);
  }});
}

export { getData as default };
