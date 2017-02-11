var BLOCKED_TYPES = ['Viewer', 'MutationRoot', 'QueryRoot', 'String', 'Boolean', 'BookInput', 'Query', 'Int']

var TypeModel = Backbone.Model.extend({
  idAttribute: 'name',
  getRelations: function(){
    var fields = this.get('fields');
    var rel_fields = _.filter(fields, function(field){
      return  (
          (field.type.kind == "LIST" && field.type.ofType.kind == "OBJECT")
          || field.type.kind == "OBJECT"
      )
    });

    var rel2 = _.map(rel_fields, function(field){
      var field_name;

      if(field.type.kind == "OBJECT"){
        field_name = field.type.name;
      }

      if(field.type.kind == "LIST" && field.type.ofType.kind == "OBJECT"){
        field_name = field.type.ofType.name;
      }

      return this.collection.get(field_name);

    }, this);

    return rel2;
  }
});

var TypeCollection = Backbone.Collection.extend({
  model: TypeModel,
  parse: function(response){
    var types = response.data.__schema.types;
    return(_.filter(types,function(type){
      return !(type.name.startsWith('__') || _.contains(BLOCKED_TYPES, type.name));
    }));
  },
  url: function(){
    var server = "http://localhost:3000/";
    var introspectParams = "?query=%20%20query%20IntrospectionQuery%20%7B%0A%20%20%20%20__schema%20%7B%0A%20%20%20%20%20%20queryType%20%7B%20name%20%7D%0A%20%20%20%20%20%20mutationType%20%7B%20name%20%7D%0A%20%20%20%20%20%20subscriptionType%20%7B%20name%20%7D%0A%20%20%20%20%20%20types%20%7B%0A%20%20%20%20%20%20%20%20...FullType%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23%20directives%20%7B%0A%20%20%20%20%20%20%23%20%20%20name%0A%20%20%20%20%20%20%23%20%20%20description%0A%20%20%20%20%20%20%23%20%20%20locations%0A%20%20%20%20%20%20%23%20%20%20args%20%7B%0A%20%20%20%20%20%20%23%20%20%20%20%20...InputValue%0A%20%20%20%20%20%20%23%20%20%20%7D%0A%20%20%20%20%20%20%23%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%0A%20%20fragment%20FullType%20on%20__Type%20%7B%0A%20%20%20%20kind%0A%20%20%20%20name%0A%20%20%20%20description%0A%20%20%20%20fields(includeDeprecated%3A%20false)%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20description%0A%20%20%20%20%20%20args%20%7B%0A%20%20%20%20%20%20%20%20...InputValue%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20type%20%7B%0A%20%20%20%20%20%20%20%20...TypeRef%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%23%20isDeprecated%0A%20%20%20%20%20%20%23%20deprecationReason%0A%20%20%20%20%7D%0A%20%20%20%20inputFields%20%7B%0A%20%20%20%20%20%20...InputValue%0A%20%20%20%20%7D%0A%20%20%20%20interfaces%20%7B%0A%20%20%20%20%20%20...TypeRef%0A%20%20%20%20%7D%0A%20%20%20%20enumValues(includeDeprecated%3A%20false)%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20description%0A%20%20%20%20%20%20isDeprecated%0A%20%20%20%20%20%20deprecationReason%0A%20%20%20%20%7D%0A%20%20%20%20possibleTypes%20%7B%0A%20%20%20%20%20%20...TypeRef%0A%20%20%20%20%7D%0A%20%20%7D%0A%0A%20%20fragment%20InputValue%20on%20__InputValue%20%7B%0A%20%20%20%20name%0A%20%20%20%20description%0A%20%20%20%20type%20%7B%20...TypeRef%20%7D%0A%20%20%20%20defaultValue%0A%20%20%7D%0A%0A%20%20fragment%20TypeRef%20on%20__Type%20%7B%0A%20%20%20%20kind%0A%20%20%20%20name%0A%20%20%20%20ofType%20%7B%0A%20%20%20%20%20%20kind%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20ofType%20%7B%0A%20%20%20%20%20%20%20%20kind%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20ofType%20%7B%0A%20%20%20%20%20%20%20%20%20%20kind%0A%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D&operationName=IntrospectionQuery";
    return server + introspectParams;
  }
});

var nodes= [];
var links= [];

window.typeCollection = new TypeCollection();
window.typeCollection.fetch({success: function(){
  window.typeCollection.each(function(m){
    var relations = m.getRelations();
    nodes.push(
      {
        'id': m.get('name')
        // ,m.get('name')
      }
    );
    _.each(relations, function(type){
      // window.console.log(type);
      links.push(
        {
          'source': m.id,
          'target': type.get('name')
        }
      );
    });
    // nodes.push({m.id, m.get('name')});
    // window.console.log(m.id);
    // window.console.log(m.cid);
    // window.console.log(m.getRelations());
  });

  var out = {
    'nodes': nodes,
    'links': links
  };

  window.console.log(JSON.stringify(out));
  // window.console.log(links);
  // alert('got it');
}})
