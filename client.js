/**
 * this client is example.
 */

const network = require("./src/core/network.js");

const foxQL = new network({});

foxQL.loadEvents([
  'searchEvent',
  'publishEvent'
]);


window.foxQL = foxQL;