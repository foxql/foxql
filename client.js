/**
 * this client is example.
 */

const network = require("./src/core/network.js");

const foxQL = new network({});

foxQL.loadEvents([
  'searchEvent',
  'publishEvent',
  'findEntryEvent'
]);


foxQL.on('listen-document', (data)=>{
  console.log(data);
});

window.foxQL = foxQL;