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
Injecting any database

```bash
npm i @foxql/foxql-index
```

Preparing database instance
```javascript
import { foxql } from 'foxql';
import foxqlIndex from "@foxql/foxql-index";
const client = new foxql();
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

client.useDbInstance(database);

clent.open();

```
