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
