const graphFactory = require('./d3graph');
const TypeCollection = require('./app');

var nodes= [];
var links= [];


function getData(){
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

    graphFactory(out);

    window.console.log(JSON.stringify(out));
    // window.console.log(links);
    // alert('got it');
  }})
}


const mockData = {
  nodes: [
    { id: 'Retweet' },
    { id: 'SearchResponse' },
    { id: 'Tweet' },
    { id: 'TwitterAPI' },
    { id: 'TwitterUser' },
    { id: 'UserIdentifier' },
    { id: 'UserIdentity' },
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
  console.log('init');
  getData();
  // graphFactory(mockData);
}


window.onload = init;
