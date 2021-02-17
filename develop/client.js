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
    title : 'test document',
    content : 'test için oluşturulmuş bir içerik',
    createDate : new Date('2021-01-01')
});

window.foxql = client;