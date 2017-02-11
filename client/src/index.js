const graphFactory = require('./d3graph');
const renderTypeTable = require('./d3TypeTable');

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
  graphFactory(mockData);
  renderTypeTable(mockData.nodes[0]);
}

window.onload = init;
