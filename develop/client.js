import foxql from '../index.js';

const client = new foxql();

client.pushEvents([
    'onDocument',
    'onSearch',
    'onRandom',
    'onDocumentByRef'
])

client.openNativeCollections();


client.use('storageOptions', {
    saveInterval : false
});

client.use('documentLengthInterval', {
    active : true,
    interval : 1000,
    maxDocumentsInCollections : [
        {
            collection : 'entrys',
            maxDocument : 30
        },
        {
            collection : 'webPage',
            maxDocument : 100
        }
    ]
});

client.open();

client.database.useCollection('entrys').addDoc({
    title : 'foxql',
    content : 'foxql contenta3'
});

client.database.useCollection('entrys').addDoc({
    title : 'foxql',
    content : 'foxql contenta123123'
});

window.foxql = client;