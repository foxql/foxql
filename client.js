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


network.pushData({
    document : {
        title : "Test başlığı",
        content : "Test içeriği!"
    },
    type : "document",
    primaryKeyMap : ['document', 'title']
});


$("button").click(()=>{
  network.push({
    listener : "message",
    data : {
      name : $("input").val()
    }
  });
});
