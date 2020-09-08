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
    ref : 'documentId'
  }
});


network.loadEvents([
  'searchEvent'
], listener=>{
  console.log(listener);
});

/*network.on('search-example-search-foxql', (data)=>{
  console.log(data)
});
*/
/*

network.loadEvents([
  'ready',
  'querySignal'
], listener=>{
  console.log(listener);
});


network.p2p.on('search-results', (results)=>{
  console.log('sonuçlar', results);
});


*/

window.foxQL = network;
