# Quick start

It is recommended to install npm.

```bash
npm install foxql
```

Example usage

```javascript
import { foxql } from 'foxql';
const client = new foxql();
client.open();
```

## Configuration

Change signaling server
```javascript
import { foxql } from 'foxql';

const client = new foxql();

client.peer.use('socketOptions', {
    host : 'foxql-signal.herokuapp.com',
    port : null,
    protocol : 'https'
});
client.open();
```

## Database
Install any database

```bash
npm i @foxql/foxql-index
```

Preparing database instance
```javascript
import foxqlIndex from "@foxql/foxql-index";
const database = new foxqlIndex();

database.pushCollection({
    collectionName : 'posts',
    fields : [
        'title',
        'content'
    ],
    ref : 'documentId',
    schema : {
        title : {
            type : 'string',
            min : 3,
            max : 80
        },
        content : {
            type : 'string',
            min : 7,
            max : 500,
        },
        documentId : {
            createField : ['title', 'content']
        }   
    }
});

database.useCollection('entrys').registerAnalyzer('tokenizer', (string)=>{
    return string.toLowerCase().replace(/  +/g, ' ').trim();
}); 

```
Injecting database instance

```javascript
client.useDbInstance(database);
clent.open(); 
```

## Events
Example event listener module helloWorldEvent.js
```javascript
const eventListenerName = 'helloWorld';

async function listener(data)
{ 
    const sender = data._by; // emitter peer id
    const simulateStatus = data._simulated;

    if(simulateStatus) { // checking data for webRTC connection
        return true;
    }


    this.peer.send(by, {
        listener : data.listener, // emitter waiting. Answer this listener name
        data :{
            message : "Hello!",
        }
    });
}

export default {
    name : eventListenerName,
    listener : listener
}
```

### Listen event
```javascript
import { foxql } from 'foxql';
import helloWorld from './helloWorldEvent.js';

const client = new foxql();

client.pushEvent(helloWorld);

client.open();
```

### Send data to listener
```javascript
import { foxql } from 'foxql';
import helloWorld from './helloWorldEvent.js';

const client = new foxql();

client.pushEvent(helloWorld);

client.open();

async function query() {

    const queryObject = {
        data: 'Hello!'
    };

    const results = await client.sendEvent(queryObject, {
        timeOut : 1200, // destroy 1.2s listener
        peerListener : 'helloWorld'
    });

    return results;
}

query();


```