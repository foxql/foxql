const FoxQL = require("./src/core/network.js");


var network = new FoxQL({
  host : "localhost",
  port : 1923,
  path : '/fox',
  maxPeers : 5,
  config: {'iceServers': []},
  database : {
    storageName : "foxql-database",
    saveInterval : 500,
    fields : [
        'title',
        'content',
        'documentType'
    ],
    ref : 'documentId',
    maxDocumentCount : 3
  }
});


network.loadEvents([
  'searchEvent',
  'publishEvent'
]);

network.on('search-example-search-foxql', (data)=>{
  console.log(data)
});


window.foxQL = network;
