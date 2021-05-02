import {foxql} from '../index.js';

const client = new foxql();

client.listenEvents([
    'onDocument',
    'onSearch',
    'onRandom',
    'onDocumentByRef',
    'onSync'
])

client.peer.use('socketOptions', {
    host : '127.0.0.1',
    port : 3000,
    protocol : 'http'
});

client.openNativeCollections();

client.use('storageOptions', {
    saveInterval : true
});

client.use('documentLengthInterval', {
    active : true,
    interval : 1000,
    maxDocumentsInCollections : [
        {
            collection : 'entrys',
            maxDocument : 2000
        }
    ]
});

client.open();

window.foxql = client;