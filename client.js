const FoxQL = require("./src/core/network.js");


var network = new FoxQL({
  numClients : 10,
  autoUpgrade : true,
  host : "http://localhost:1200",
  storageName : "foxql-storage"
});

network.open(connect =>{
  console.log(connect);
});


network.loadEvents([
  'message',
  'ready'
], listener=>{
  console.log(listener);
});


window.foxQL = network;
