## Install

### NPM

```
npm install foxql
```

``` javascript
import {foxql} from 'foxql';
const client = new foxql();
client.open();
```

## Crawl Our Web Page
This example a realtime index your web page and sending other nodes.
``` javascript
client.pushEvents([
    'onSearch'
])

client.openNativeCollections();

client.open();

const document = {
    title : document.title,
    description : document.querySelector('meta[name="description"]').content, // change this selector on your using dom element.
    url : window.location.href,
    domain : window.location.hostname
};

client.database.useCollection('webPage').addDoc(document);
client.publishDocument(document, 'webPage');
```




## Events

### FoxQL native event listeners

``` javascript
client.listenEvents([
    'onDocument',
    'onSearch',
    'onRandom',
    'onDocumentByRef'
])
```

### Send query package native listeners

#### Search document foxql network

``` javascript
async function query() {

    const queryObject = {
        query : 'test',
        collection : 'entrys'
    };

    const results = await foxql.sendEvent(queryObject, {
        timeOut : 1200, // destroy 1.2s listener
        peerListener : 'onSearch'
    });

    console.log(results);
}
```

#### Get random document foxql network

``` javascript
async function query() {

    const queryObject = {
        limit : 2,
        collection : 'entrys'
    };

    const results = await foxql.sendEvent(queryObject, {
        timeOut : 1200, // destroy 1.2s listener
        peerListener : 'onRandom'
    });

    console.log(results);
}
```

#### Find document by ref in foxql network

``` javascript
async function query() {

    const queryObject = {
        ref : '642553c0276a72ad6a86d32755e04fd534df17b9497d9118da3ec84780576f2e',
        collection : 'entrys'
    };

    const results = await foxql.sendEvent(queryObject, {
        timeOut : 1200, // destroy 1.2s listener
        peerListener : 'onDocumentByRef'
    });

    console.log(results);
}

```


##### Match specific field
``` javascript
async function query() {

    const queryObject = {
        ref : '642553c0276a72ad6a86d32755e04fd534df17b9497d9118da3ec84780576f2e',
        collection : 'entrys',
        match : {
            field : 'entryKey',
            value : 'parent-key'
        }
    };

    const results = await foxql.sendEvent(queryObject, {
        timeOut : 1000, // destroy 1.2s listener
        peerListener : 'onDocumentByRef'
    });

    console.log(results);
}
```


#### Publish a new document

``` javascript
client.publishDocument({
    content : 'published test document content',
    title : 'published!',
    documentId : '10239129381'
}, 'entrys');

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
