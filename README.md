# FoxQL
Peer to peer full text search engine that runs on your browser. 
We're developing FoxQL for bring freedom to internet and make you anonymous

### Active Sub Projects
| Project Name  |  Github | Npm |
| ------------ | ------------ |--------- |
| Foxql-index  | [Repo](https://github.com/boraozer/foxql-index "Repo")   | [Npm](https://cutt.ly/JhNPhum "Npm") |
| Foxql-server  |  [Repo](https://github.com/boraozer/foxql-server "Repo") |[Npm](https://cutt.ly/8hNPc5X "Npm") |
|Foxql-peer | [Repo](https://github.com/boraozer/foxql-peer "Repo") | [Npm](https://cutt.ly/rhNPWcZ "Npm") |
|Foxql-frontend | [Repo](https://github.com/boraozer/foxql-frontend "Repo") | [Npm](# "Npm") |

[Public Trello](https://trello.com/b/rkbH49p7/foxql "Public Trello")

### Documentation

#### Install
```
npm i foxql
```

``` javascript
import foxql from 'foxql';

const client = new foxql();

client.open();
```

#### Change Configuration

``` javascript
import foxql from 'foxql';

const client = new foxql();

client.use('indexOptions', {
    fields : [
        'title',
        'content',
        'image',
        'url'
    ],
    ref : 'documentId'
});

client.open();
```


#### How to listen native events

``` javascript
client.pushEvents([
    'onDocument',
    'onSearch',
    'onRandom'
])
```

#### Search on active peers

``` javascript
async function query() {
    const results = await client.search({
        query : 'example query',
        timeOut : 300
    });

    console.log(results);
}
```

#### Publish document on active peers

``` javascript
client.publishDocument({
    content : 'published test document content',
    title : 'published!',
    documentId : '10239129381'
}, 'entrys');

```

#### Storage Setup

``` javascript
client.use('storageOptions', {
    saveInterval : true, // open storage
    interval : 200 // index save status control interval timer (miliseconds),
    name : 'foxql-storage' // storage name
});


```



#### Get random documents on active connection
``` javascript
foxql.randomDocument({
    limit : 2,
    collection : 'entrys',
    timeOut : 300
},(documents)=>{
    console.log(documents)
});
```

#### Close spesific peer datachannel and webrtc object
``` javascript
foxql.dropPeer('peerID');
```