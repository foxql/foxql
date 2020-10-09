const network = require("./src/core/network.js");

const foxQL = new network({});

foxQL.loadEvents([
  'searchEvent',
  'publishEvent'
]);

const searchEventListener = {
    name : 'search-example-search-foxql',
    listenerDropTime : 300
};

foxQL.on(searchEventListener, (data)=>{
  console.log(data)
},(droppedEvent)=>{
  console.log('Event kaldırıldı.');
});


window.foxQL = foxQL;