import Backbone from 'backbone';

const BLOCKED_TYPES = ['Viewer', 'MutationRoot', 'QueryRoot', 'String', 'Boolean', 'BookInput', 'Query', 'Int'];
const INTROSPECTION_PARAMS = '?query=%20%20query%20IntrospectionQuery%20%7B%0A%20%20%20%20__schema%20%7B%0A%20%20%20%20%20%20queryType%20%7B%20name%20%7D%0A%20%20%20%20%20%20mutationType%20%7B%20name%20%7D%0A%20%20%20%20%20%20subscriptionType%20%7B%20name%20%7D%0A%20%20%20%20%20%20types%20%7B%0A%20%20%20%20%20%20%20%20...FullType%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23%20directives%20%7B%0A%20%20%20%20%20%20%23%20%20%20name%0A%20%20%20%20%20%20%23%20%20%20description%0A%20%20%20%20%20%20%23%20%20%20locations%0A%20%20%20%20%20%20%23%20%20%20args%20%7B%0A%20%20%20%20%20%20%23%20%20%20%20%20...InputValue%0A%20%20%20%20%20%20%23%20%20%20%7D%0A%20%20%20%20%20%20%23%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%0A%20%20fragment%20FullType%20on%20__Type%20%7B%0A%20%20%20%20kind%0A%20%20%20%20name%0A%20%20%20%20description%0A%20%20%20%20fields(includeDeprecated%3A%20false)%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20description%0A%20%20%20%20%20%20args%20%7B%0A%20%20%20%20%20%20%20%20...InputValue%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20type%20%7B%0A%20%20%20%20%20%20%20%20...TypeRef%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23%20isDeprecated%0A%20%20%20%20%20%20%23%20deprecationReason%0A%20%20%20%20%7D%0A%20%20%20%20inputFields%20%7B%0A%20%20%20%20%20%20...InputValue%0A%20%20%20%20%7D%0A%20%20%20%20interfaces%20%7B%0A%20%20%20%20%20%20...TypeRef%0A%20%20%20%20%7D%0A%20%20%20%20enumValues(includeDeprecated%3A%20false)%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20description%0A%20%20%20%20%20%20isDeprecated%0A%20%20%20%20%20%20deprecationReason%0A%20%20%20%20%7D%0A%20%20%20%20possibleTypes%20%7B%0A%20%20%20%20%20%20...TypeRef%0A%20%20%20%20%7D%0A%20%20%7D%0A%0A%20%20fragment%20InputValue%20on%20__InputValue%20%7B%0A%20%20%20%20name%0A%20%20%20%20description%0A%20%20%20%20type%20%7B%20...TypeRef%20%7D%0A%20%20%20%20defaultValue%0A%20%20%7D%0A%0A%20%20fragment%20TypeRef%20on%20__Type%20%7B%0A%20%20%20%20kind%0A%20%20%20%20name%0A%20%20%20%20ofType%20%7B%0A%20%20%20%20%20%20kind%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20ofType%20%7B%0A%20%20%20%20%20%20%20%20kind%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20ofType%20%7B%0A%20%20%20%20%20%20%20%20%20%20kind%0A%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D&operationName=IntrospectionQuery';

function isRelation({ type }) {
  return (type.kind === 'LIST' && type.ofType.kind === 'OBJECT') || type.kind === 'OBJECT';
}

function getFieldName(field) {
  if (field.type.kind === 'OBJECT') {
    return field.type.name;
  }

  return field.type.ofType.name;
}

const TypeModel = Backbone.Model.extend({
  idAttribute: 'name',

  getRelations() {
    return (this.get('fields') || [])
      .filter(isRelation)
      .map(f => this.collection.get(getFieldName(f)));
  },
});

const TypeCollection = Backbone.Collection.extend({
  model: TypeModel,

  initialize(options) {
    this.options = options;
  },

  parse({ data: { __schema: { types } } }) {
    return types.filter(({ name }) =>
      !(name.startsWith('__') || BLOCKED_TYPES.indexOf(name) >= 0));
  },

  url() {
    const { urlRoot } = this.options;
    return `${urlRoot}${INTROSPECTION_PARAMS}`;
  },
});


export { TypeCollection as default };
