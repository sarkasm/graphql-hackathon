const graphFactory = require('./d3graph');
const renderTypeTable = require('./d3TypeTable');
const TypeCollection = require('./app');


function getData(urlRoot){
  var nodes= [];
  var links= [];

  window.typeCollection = new TypeCollection({urlRoot: urlRoot});
  window.typeCollection.fetch({success: function(){
    window.typeCollection.each(function(m){
      var relations = m.getRelations();
      // window.console.log(m);
      // window.console.log(m.get('fields')[0].name);
      // window.console.log(_.pluck(m.get('fields')));

      var fields = m.get('fields');
      var field_names = [];
      _.each(fields, function(field){
        field_names.push(field.name);
      });
      nodes.push(
        {
          'id': m.get('name'),
          'entity': 'type',
          'fields': field_names
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

    graphFactory(out);
    renderTypeTable(out.nodes[0]);

    // window.console.log(JSON.stringify(out));
    // window.console.log(links);
    // alert('got it');
  }})
}

const mockData = {
  nodes: [
    { id: 'Retweet', entity: 'type', fields: [
      'id: ID',
      'created_at: String',
      'in_reply_to_tweet_id: String',
      'in_reply_to_user_id: Int',
      'in_reply_to_screen_name: String',
      'retweeted_status: Tweet',
      'user: TwitterUser',
    ] },

    { id: 'SearchResponse', entity: 'enum', fields: [ 'mixed', 'recent', 'popular' ] },

    { id: 'Tweet', entity: 'type', fields: [
      'id: ID',
      'created_at: String',
      'text: String',
      'retweet_count: Int',
      'user: TwitterUser',
      'retweets(limit: Int = 5): [Retweet]',
    ] },

    { id: 'TwitterAPI', entity: 'type', fields: [
      'user(identifier: UserIdentifier!, identity: UserIdentity!): TwitterUser',
      'tweet(id: String!): Tweet',
      'search(q: String!, count: Int, result_type: SearchReponse): [Tweet]',
    ] },

    { id: 'TwitterUser', entity: 'type', fields: [
      'created_at: String',
      'description: String',
      'id: ID',
      'screen_name: String',
      'name: String',
      'profile_image_url: String',
      'url: String',
      'tweets_count: Int',
      'followers_count: Int',
      'tweets(limit: Int = 10): [Tweet]',
    ] },

    { id: 'UserIdentifier', type: 'enum', fields: [ 'id', 'name', ] },

    { id: 'UserIdentity', type: 'scalar', fields: [ ] },
  ],
  links: [
    { source: 'Retweet', target: 'Tweet', field: 'retweeted_status' },
    { source: 'Tweet', target: 'Retweet', field: 'retweets' },
    { source: 'Retweet', target: 'TwitterUser', field: 'user' },
    { source: 'Tweet', target: 'TwitterUser', field: 'user' },
    { source: 'TwitterAPI', target: 'TwitterUser', field: 'user' },
    { source: 'TwitterAPI', target: 'Tweet', field: 'tweet' },
    { source: 'TwitterAPI', target: 'Tweet', field: 'search' },
    { source: 'TwitterUser', target: 'Tweet', field: 'tweets' },
  ]
}

function init() {

  document.querySelector('button').addEventListener('click', () => {
    document.querySelector('svg').innerHTML = "";
    getData(document.querySelector('input').value);
  })
}

window.onload = init;
