# FoxQL
Peer to peer full text search engine running in your browser. 
we building for anonymous and freedom internet.

### Active Sub Projects
| Project Name  |  Github | Npm |
| ------------ | ------------ |--------- |
| Foxql-index  | [Repo](https://github.com/boraozer/foxql-index "Repo")   | [Npm](https://cutt.ly/JhNPhum "Npm") |
| Foxql-server  |  [Repo](https://github.com/boraozer/foxql-server "Repo") |[Npm](https://cutt.ly/8hNPc5X "Npm") |
|Foxql-peer | [Repo](https://github.com/boraozer/foxql-peer "Repo") | [Npm](https://cutt.ly/rhNPWcZ "Npm") |

[Public Trello](https://trello.com/b/rkbH49p7/foxql "Public Trello")

This project depencies, moving to foxql packages.


### Documentation

#### Install

``` javascript
import foxql from '../index.js';

const client = new foxql();

client.open();
```

#### Change Configuration

``` javascript
import foxql from '../index.js';

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
    'onSearch'
])
```

#### Search on active peers

``` javascript
client.search({
    query : 'example query',
    timeOut : 300
}, callback);

async function callback(results)
{
    console.log(results);
}
```

#### Storage Setup

``` javascript
client.use('storageOptions', {
    saveInterval : true, // open storage
    interval : 200 // index save status control interval timer (miliseconds),
    name : 'foxql-storage' // storage name
});


```