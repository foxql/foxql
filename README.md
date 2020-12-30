# FoxQL
![#](https://i.imgyukle.com/2020/12/30/aXwaPA.png)
Peer to peer full text search engine that runs on your browser. 
We're developing FoxQL for bring freedom to internet and make you anonymous

## Active Sub Projects
| Project Name  |  Github | Npm |
| ------------ | ------------ |--------- |
| Foxql-index  | [Repo](https://github.com/boraozer/foxql-index "Repo")   | [Npm](https://cutt.ly/JhNPhum "Npm") |
| Foxql-server  |  [Repo](https://github.com/boraozer/foxql-server "Repo") |[Npm](https://cutt.ly/8hNPc5X "Npm") |
|Foxql-peer | [Repo](https://github.com/boraozer/foxql-peer "Repo") | [Npm](https://cutt.ly/rhNPWcZ "Npm") |
|Foxql-frontend | [Repo](https://github.com/boraozer/foxql-frontend "Repo") | [Npm](# "Npm") |
|Foxql-crawler | [Repo](https://github.com/boraozer/foxql-crawler "Repo") | [Npm](# "Npm") |

## Install

Use global variable
```
<script src = "https://cdn.jsdelivr.net/npm/foxql/build/foxql.min.js"></script>
```

``` javascript
const client = new foxql.client();
client.open();
```

or
```
npm install foxql
```


``` javascript
import foxql from 'foxql';
const client = new foxql();
client.open();
```

## Documentation


#### Native Listeners
| Listener Name  |  What is |
| ------------ | ------------ |
| onDocument | if dedected a new document, you database copying this document  |
| onSearch | if dedected new search query, search your own databasess and send results |
| onRandom | find random document on your database and send them all |

#### Hot to open native listeners

``` javascript
client.pushEvents([
    'onDocument',
    'onSearch',
    'onRandom'
])
```

#### Search on active connections

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