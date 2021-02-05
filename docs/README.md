## Install

### CDN

Use global variable
```
<script src = "https://cdn.jsdelivr.net/npm/foxql@latest/build/foxql.min.js"></script>
```

``` javascript
const client = new foxql.client();
client.open();
```
### NPM

```
npm install foxql
```

``` javascript
import foxql from 'foxql';
const client = new foxql();
client.open();
```

## Events

### onDocument
Listen all news documents and write database
### onSearch
Listen all search query in foxql network
### onRandom
Listen random document query
### onDocumentByRef
Listen find document by ref querys all network.

#### Open native event listeners

``` javascript
client.pushEvents([
    'onDocument',
    'onSearch',
    'onRandom',
    'onDocumentByRef'
])
```

## Emitters

### Search in foxql network

``` javascript
async function query() {
    const results = await client.search({
        query : 'example query',
        timeOut : 300
    });

    console.log(results);
}
```

### Publish a new document

``` javascript
client.publishDocument({
    content : 'published test document content',
    title : 'published!',
    documentId : '10239129381'
}, 'entrys');

```

### Get random document
``` javascript
foxql.randomDocument({
    limit : 2,
    collection : 'entrys',
    timeOut : 300
},(documents)=>{
    console.log(documents)
});
```

### Find document by ref
``` javascript
let documents = await foxql.findDocument({  
    ref : '7d5bb20bd09fec363bb6cabde4eea1150940edd4a0d4a29f25f17757ffe47a68',
    collection : 'entrys',
    timeOut : 500
});
```

#### Match spesific field
``` javascript
let documents = await foxql.findDocument({  
    ref : '7d5bb20bd09fec363bb6cabde4eea1150940edd4a0d4a29f25f17757ffe47a68',
    collection : 'entrys',
    timeOut : 500,
    match : {
        field : 'entryKey',
        value : 'parent-key'
    }
});
```

## Storage

### Open Storage
``` javascript
client.use('storageOptions', {
    saveInterval : true, // open storage
    interval : 200 // index save status control interval timer (miliseconds),
    name : 'foxql-storage' // storage name
});
```
### Set max document size
```javascript

client.use('documentLengthInterval', {
    active : true,
    interval : 1000,
    maxDocumentsInCollections : [
        {
            collection : 'entrys',
            maxDocument : 1
        },
        {
            collection : 'webPage',
            maxDocument : 100
        }
    ]
});
```

## Peer

### Close spesific peer
``` javascript
foxql.dropPeer('peerID');
```
